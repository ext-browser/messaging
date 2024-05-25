export const getHandlers = (name) => {
  const port = chrome.runtime.connect({ name });

  return {
    onMessage: (eventName, callback) => {
      port.onMessage.addListener((event) => {
        if (event.eventName === eventName) {
          callback(event.eventData, event);
        }
      });
    },
    sendMessage: (to, eventName, data) => {
      const eventData = data;

      port.postMessage({ to, eventName, eventData });
    },
  };
};
