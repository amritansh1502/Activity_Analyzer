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
      logActivity({
        eventType: 'idle',
        duration: idleDuration,
        timestamp: new Date().toISOString(),
      });
    }, 60000); // 1 minute idle threshold
  };

  useEffect(() => {
    if (!userToken) return;

    const handleClick = () => {
      setActivityCounts((prev) => ({ ...prev, clicks: prev.clicks + 1 }));
      logActivity({
        eventType: 'click',
        duration: 0,
        timestamp: new Date().toISOString(),
      });
      lastActivityTime.current = Date.now();
      resetIdleTimer();
    };

    const handleScroll = () => {
      setActivityCounts((prev) => ({ ...prev, scrolls: prev.scrolls + 1 }));
      logActivity({
        eventType: 'scroll',
        duration: 0,
        timestamp: new Date().toISOString(),
      });
      lastActivityTime.current = Date.now();
      resetIdleTimer();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isWindowFocused.current = false;
        logActivity({
          eventType: 'tab_switch',
          duration: 0,
          timestamp: new Date().toISOString(),
        });
        setActivityCounts((prev) => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
      } else {
        isWindowFocused.current = true;
        lastActivityTime.current = Date.now();
        resetIdleTimer();
      }
    };

    const handleKeyDown = () => {
      setActivityCounts((prev) => ({ ...prev, keyPresses: prev.keyPresses + 1 }));
      logActivity({
        eventType: 'key_press',
        duration: 0,
        timestamp: new Date().toISOString(),
      });
      lastActivityTime.current = Date.now();
      resetIdleTimer();
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);

    resetIdleTimer();

    window.addEventListener('beforeunload', sendRemainingEvents);

    // Periodic flush of batched events every 30 seconds
    const intervalId = setInterval(() => {
      if (eventBuffer.current.length > 0) {
        const batch = eventBuffer.current.splice(0, eventBuffer.current.length);
        sendBatch(batch);
      }
    }, 30000);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', sendRemainingEvents);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      clearInterval(intervalId);
    };
  }, [userToken]);

  return activityCounts;
};

export default useActivityTracker;
