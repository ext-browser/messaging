/* eslint-disable arrow-body-style */
import { timeOutPromise } from "./utils";

export const getMessagingPort = (name, customPort) => {
  let port = null;
  let onMessage = null;
  let sendMessage = null;
  let onMessageWithResponse = null;
  let sendMessageWithResponse = null;

  const init = () => {
    port = customPort || chrome.runtime.connect({ name });

    port.onDisconnect.addListener(init);

    const onMessageInternal = ({ withResponse }) => {
      return (eventName, callback) => {
        port.onMessage.addListener(async (event) => {
          if (event.eventName === eventName) {
            try {
              const response = await callback(event.eventData, event);

              if (withResponse) {
                port.postMessage({
                  ...event,
                  to: event.from,
                  eventName: `${event.eventName}::RESPONSE`,
                  eventData: response,
                });
              }
            } catch (error) {
              if (withResponse) {
                port.postMessage({
                  ...event,
                  to: event.from,
                  eventName: `${event.eventName}::RESPONSE_ERROR`,
                  eventData: error,
                });
              }
            }
          }
        });
      };
    };

    const sendMessageInteral = ({ withResponse }) => {
      return (to, eventName, eventData) => {
        port.postMessage({ to, eventName, eventData });

        if (withResponse) {
          return Promise.race([
            new Promise((resolve, reject) => {
              port.onMessage.addListener((event) => {
                if (event.eventName === `${eventName}::RESPONSE`) {
                  resolve(event.eventData, event);
                }
                if (event.eventName === `${eventName}::RESPONSE_ERROR`) {
                  reject(event.eventData, event);
                }
              });
            }),
            timeOutPromise(30000),
          ]);
        }
      };
    };

    onMessage = onMessageInternal({ withResponse: false });
    sendMessage = sendMessageInteral({ withResponse: false });
    onMessageWithResponse = onMessageInternal({ withResponse: true });
    sendMessageWithResponse = sendMessageInteral({ withResponse: true });
  };

  init();

  return {
    onMessage,
    sendMessage,
    onMessageWithResponse,
    sendMessageWithResponse,
  };
};
