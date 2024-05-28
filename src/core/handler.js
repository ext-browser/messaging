/* eslint-disable arrow-body-style */

export const getHandlers = (name) => {
  let port = null;

  const initHandlers = () => {
    port = chrome.runtime.connect({ name });

    port.onDisconnect.addListener(initHandlers);

    const onMessage = ({ withResponse }) => {
      return (eventName, callback) => {
        port.onMessage.addListener(async (event) => {
          if (event.eventName === eventName) {
            const response = await callback(event.eventData, event);

            if (withResponse) {
              port.postMessage({
                ...event,
                to: event.from,
                eventName: `${event.eventName}::RESPONSE`,
                eventData: response,
              });
            }
          }
        });
      };
    };

    const sendMessage = ({ withResponse }) => {
      return (to, eventName, eventData) => {
        port.postMessage({ to, eventName, eventData });

        if (withResponse) {
          return new Promise((resolve) => {
            port.onMessage.addListener((event) => {
              if (event.eventName === `${eventName}::RESPONSE`) {
                resolve(event.eventData, event);
              }
            });
          });
        }
      };
    };

    return {
      onMessage: onMessage({ withResponse: false }),
      sendMessage: sendMessage({ withResponse: false }),
      onMessageWithResponse: onMessage({ withResponse: true }),
      sendMessageWithResponse: sendMessage({ withResponse: true }),
    };
  };

  return initHandlers();
};
