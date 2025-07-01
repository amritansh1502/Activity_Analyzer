let currentTabId = null;
let currentUrl = null;
let visitStartTime = null;
let visitDataBuffer = [];

const API_BASE_URL = "https://focusly-an-activity-analyzer.onrender.com/api"; // Adjust to your backend URL

// Function to send batched visit data to backend
async function sendVisitDataBatch() {
  if (visitDataBuffer.length === 0) return;

  try {
    const token = await getAuthToken();
    if (!token) {
      console.warn("No auth token found, skipping sending visit data");
      return;
    }

    console.log("Sending visit data batch with token:", token);

    const response = await fetch(API_BASE_URL + "/activity/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(visitDataBuffer)
    });

    if (!response.ok) {
      console.error("Failed to send visit data batch", response.statusText);
    } else {
      console.log("Visit data batch sent successfully");
      visitDataBuffer = [];
    }
  } catch (error) {
    console.error("Error sending visit data batch", error);
  }
}

// Function to get auth token from extension storage or prompt user
function getAuthToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["authToken"], (result) => {
      resolve(result.authToken || null);
    });
  });
}

// Function to record visit data when tab changes or URL changes
function recordVisitData(newTabId, newUrl) {
  const now = Date.now();

  if (currentUrl && visitStartTime) {
    const duration = now - visitStartTime;
    visitDataBuffer.push({
      eventType: "website_visit",
      timestamp: new Date(visitStartTime).toISOString(),
      duration: duration,
      websiteUrl: currentUrl
    });
  }

  currentTabId = newTabId;
  currentUrl = newUrl;
  visitStartTime = now;

  // Send batch if buffer size exceeds threshold
  if (visitDataBuffer.length >= 10) {
    sendVisitDataBatch();
  }
}

// Listen for tab activation changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url) {
      recordVisitData(activeInfo.tabId, new URL(tab.url).hostname);
    }
  });
});

// Listen for tab updates (URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === currentTabId && changeInfo.url) {
    recordVisitData(tabId, new URL(changeInfo.url).hostname);
  }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // User has focused away from browser, record visit end
    recordVisitData(null, null);
  } else {
    // Get active tab in focused window
    chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
      if (tabs.length > 0) {
        recordVisitData(tabs[0].id, new URL(tabs[0].url).hostname);
      }
    });
  }
});

// Periodically send any remaining visit data
setInterval(() => {
  sendVisitDataBatch();
}, 15000); // every 15 seconds

// On extension unload, send remaining data
self.addEventListener("unload", () => {
  sendVisitDataBatch();
});
