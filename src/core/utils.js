export const MAX_DATA_SIZE = 5 * 1024 * 1024; // 50MB

export const getCurrentTab = async () => {
  if (!chrome.tabs?.query) {
    return null;
  }

  const queryOptions = { active: true, lastFocusedWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);
  return tabs[0];
};

export const getAllTabs = async () => {
  if (!chrome.tabs?.query) {
    return null;
  }

  const tabs = await chrome.tabs.query({});

  return tabs;
};

export const isMessageLenghtExceeded = (message) => message.includes("Message length exceeded maximum allowed length");
