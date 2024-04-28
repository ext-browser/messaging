export const getHandlers = (name) => {
  const port = chrome.runtime.connect({ name });

  return {
    onMessage: (eventName, callback) => {
      port.onMessage.addListener((event) => {
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
