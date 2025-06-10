import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const useActivityTracker = (userToken) => {
  const [activityCounts, setActivityCounts] = useState({
    clicks: 0,
    scrolls: 0,
    idleTime: 0,
    tabSwitches: 0,
    keyPresses: 0,
  });

  const idleTimeout = useRef(null);
  const lastActivityTime = useRef(Date.now());
  const isWindowFocused = useRef(true);
  const eventBuffer = useRef([]);
  const isFocused = useRef(false);
  const focusStartTime = useRef(null);

  // Track current website URL and time spent
  const currentWebsite = useRef(window.location.hostname);
  const websiteStartTime = useRef(Date.now());

  // Helper to send batched activities to backend
  const sendBatch = async (batch) => {
    if (batch.length === 0) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/activity/log`, batch, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to send batch activity:', error);
    }
  };

  // Add event to buffer and send if threshold reached
  const logActivity = (event) => {
    eventBuffer.current.push(event);
    if (eventBuffer.current.length >= 10) {
      const batch = eventBuffer.current.splice(0, 10);
      sendBatch(batch);
    }
  };

  // Send remaining events on unload using sendBeacon or axios fallback
  const sendRemainingEvents = () => {
    if (eventBuffer.current.length === 0) return;
    const payload = JSON.stringify(eventBuffer.current);
    const url = `${import.meta.env.VITE_API_BASE_URL}/activity/log`;
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      eventBuffer.current = [];
    } else {
      // fallback to axios synchronous request (not ideal but fallback)
      sendBatch(eventBuffer.current);
      eventBuffer.current = [];
    }
  };

  // Reset idle timer
  const resetIdleTimer = () => {
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    idleTimeout.current = setTimeout(() => {
      const idleDuration = Date.now() - lastActivityTime.current;
      setActivityCounts((prev) => ({
        ...prev,
        idleTime: prev.idleTime + idleDuration,
      }));
      if (isFocused.current) {
        logActivity({
          eventType: 'focus',
          duration: idleDuration,
          timestamp: new Date().toISOString(),
          websiteUrl: currentWebsite.current,
        });
        isFocused.current = false;
        focusStartTime.current = null;
      } else {
        logActivity({
          eventType: 'distraction',
          duration: idleDuration,
          timestamp: new Date().toISOString(),
          websiteUrl: currentWebsite.current,
        });
      }
    }, 30000); // Reduced idle threshold to 30 seconds for better responsiveness
  };

  // Define startFocus and endFocus functions
  const startFocus = () => {
    if (!isFocused.current) {
      isFocused.current = true;
      focusStartTime.current = Date.now();
    }
  };

  const endFocus = () => {
    if (isFocused.current && focusStartTime.current) {
      const focusDuration = Date.now() - focusStartTime.current;
      logActivity({
        eventType: 'focus',
        duration: focusDuration,
        timestamp: new Date().toISOString(),
        websiteUrl: currentWebsite.current,
      });
      isFocused.current = false;
      focusStartTime.current = null;
    }
  };

  useEffect(() => {
    if (!userToken) return;

    // Track website URL changes and send website_visit events
    let lastWebsite = currentWebsite.current;

    const sendWebsiteVisit = (duration) => {
      logActivity({
        eventType: 'website_visit',
        duration,
        timestamp: new Date().toISOString(),
        websiteUrl: currentWebsite.current,
      });
    };

    const checkWebsiteChange = () => {
      const newWebsite = window.location.hostname;
      if (newWebsite !== lastWebsite) {
        const now = Date.now();
        const duration = now - websiteStartTime.current;
        sendWebsiteVisit(duration);
        lastWebsite = newWebsite;
        currentWebsite.current = newWebsite;
        websiteStartTime.current = now;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isWindowFocused.current = false;
        endFocus();
        const now = Date.now();
        const duration = now - websiteStartTime.current;
        sendWebsiteVisit(duration);
        logActivity({
          eventType: 'tab_switch',
          duration: 0,
          timestamp: new Date().toISOString(),
          websiteUrl: currentWebsite.current,
        });
        setActivityCounts((prev) => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
      } else {
        isWindowFocused.current = true;
        lastActivityTime.current = Date.now();
        resetIdleTimer();
        startFocus();
        websiteStartTime.current = Date.now();
      }
    };

    const intervalIdWebsiteCheck = setInterval(() => {
      checkWebsiteChange();
    }, 10000); // Check every 10 seconds

    // Update logActivity calls to include websiteUrl
    const handleClick = () => {
      setActivityCounts((prev) => ({ ...prev, clicks: prev.clicks + 1 }));
      logActivity({
        eventType: 'click',
        duration: 0,
        timestamp: new Date().toISOString(),
        websiteUrl: currentWebsite.current,
      });
      lastActivityTime.current = Date.now();
      resetIdleTimer();
      startFocus();
    };

    const handleScroll = () => {
      setActivityCounts((prev) => ({ ...prev, scrolls: prev.scrolls + 1 }));
      logActivity({
        eventType: 'scroll',
        duration: 0,
        timestamp: new Date().toISOString(),
        websiteUrl: currentWebsite.current,
      });
      lastActivityTime.current = Date.now();
      resetIdleTimer();
      startFocus();
    };

    const handleKeyDown = () => {
      setActivityCounts((prev) => ({ ...prev, keyPresses: prev.keyPresses + 1 }));
      logActivity({
        eventType: 'key_press',
        duration: 0,
        timestamp: new Date().toISOString(),
        websiteUrl: currentWebsite.current,
      });
      lastActivityTime.current = Date.now();
      resetIdleTimer();
      startFocus();
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);

    resetIdleTimer();
    startFocus();

    window.addEventListener('beforeunload', () => {
      const now = Date.now();
      const duration = now - websiteStartTime.current;
      sendWebsiteVisit(duration);
      sendRemainingEvents();
    });

    // Periodic flush of batched events every 15 seconds
    const intervalId = setInterval(() => {
      if (eventBuffer.current.length > 0) {
        const batch = eventBuffer.current.splice(0, eventBuffer.current.length);
        sendBatch(batch);
      }
    }, 15000); // Flush every 15 seconds for more timely updates

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', sendRemainingEvents);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      clearInterval(intervalId);
      clearInterval(intervalIdWebsiteCheck);
    };
  }, [userToken]);

  return activityCounts;
};

export default useActivityTracker