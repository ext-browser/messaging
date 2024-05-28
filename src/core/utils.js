export const MAX_DATA_SIZE = 5 * 1024 * 1024; // 50MB

export const getCurrentTab = async () => {
  if (!chrome.tabs?.query) {
    return null;
  }

  const queryOptions = { active: true };
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

export const timeOutPromise = (time) => new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error("Timeout"));
  }, time)
});

export const computePortName = async (portName) => {
  if (portName.includes(":")) {
    const [to, tabId] = portName.split(":");

    if (tabId === "active") {
      const tab = await getCurrentTab();
      return `${to}:${tab.id}`;
    }
  }

  return portName;
};
