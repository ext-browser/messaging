export const getHandlers = (name) => {
  const port = chrome.runtime.connect({ name });

  return {
    onMessage: (eventName, callback) => {
      port.onMessage.addListener((event, sender, sendResponse) => {
        console.log(event, sender, sendResponse);
        if (event.eventName === eventName) {
          callback(JSON.parse(event.eventData));
        }
      });
    },
    sendMessage: (to, eventName, data) => {
      const eventData = JSON.stringify(data);

      port.postMessage({ to, eventName, eventData });
    },
  };
};
