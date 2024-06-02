/* eslint-disable arrow-body-style */
import { timeOutPromise } from "./utils";

export const getMessagingPort = (name, customPort) => {
  let port = null;
  let onMessage = null;
  let sendMessage = null;

  const init = () => {
    port = customPort || chrome.runtime.connect({ name });

    port.onDisconnect.addListener(init);

    onMessage = (eventName, callback) => {
      port.onMessage.addListener(async (event) => {
        if (event?.eventName === eventName) {
          try {
            const response = await callback(event.eventData, event);

            port.postMessage({
              ...event,
              to: event.from,
              eventName: `${event.eventName}::RESPONSE`,
              eventData: response,
            });
          } catch (error) {
            port.postMessage({
              ...event,
              to: event.from,
              eventName: `${event.eventName}::RESPONSE_ERROR`,
              eventData: error,
            });
          }
        }
      });
    };

    sendMessage = (to, eventName, eventData) => {
      port.postMessage({ to, eventName, eventData });

      return Promise.race([
        new Promise((resolve, reject) => {
          port.onMessage.addListener((event) => {
            if (event?.eventName === `${eventName}::RESPONSE`) {
              resolve(event.eventData, event);
            }
            if (event?.eventName === `${eventName}::RESPONSE_ERROR`) {
              reject(event.eventData, event);
            }
          });
        }),
        timeOutPromise(30000),
      ]);
    };
  };

  init();

  return {
    onMessage,
    sendMessage,
  };
};
