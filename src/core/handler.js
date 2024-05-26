export const getHandlers = (name) => {
  let port = null;

  const initHandlers = () => {
    port = chrome.runtime.connect({ name });

    port.onDisconnect.addListener(initHandlers);

    return {
      onMessage: (eventName, callback) => {
        port.onMessage.addListener((event) => {
          if (event.eventName === eventName) {
            const response = callback(event.eventData, event);
            port.postMessage({
              ...event,
              to: event.from,
              eventName: `${event.eventName}::RESPONSE`,
              eventData: response,
            });
          }
        });
      },
      sendMessage: (to, eventName, eventData) => {
        port.postMessage({ to, eventName, eventData });

        return new Promise((resolve) => {
          port.onMessage.addListener((event) => {
            if (event.eventName === `${eventName}::RESPONSE`) {
              resolve(event.eventData, event);
            }
          });
        });
      },
    };
  };

  return initHandlers();
};
