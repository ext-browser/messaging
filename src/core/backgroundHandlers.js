/* eslint-disable arrow-body-style */
import { getCurrentTab } from "./utils";

export const getHandlers = () => {
  const portMap = new Map();
  const callbackMap = new Map();

  const computePortName = async (portName) => {
    if (portName.includes(":")) {
      const [to, tabId] = portName.split(":");

      if (tabId === "active") {
        const tab = await getCurrentTab();
        return `${to}:${tab.id}`;
      }
    }

    return portName;
  };

  const postEvent = (cbMap, mapKey, { portName, event, port }) => {
    const eventParams = {
      ...event,
      event,
      from: portName,
      port,
      sender: port.sender,
    };

    if (cbMap.has(mapKey)) {
      cbMap.get(mapKey).postMessage(eventParams);
    }
  };

  const initMessaging = () => {
    chrome.runtime.onConnect.addListener((port) => {
      let portName = port.name;

      if (portName === "content") {
        portName = `${portName}:${port.sender.tab.id}`;
      }

      portMap.set(portName, port);

      port.onMessage.addListener(async (event) => {
        if (event.to === "background") {
          postEvent(callbackMap, event.eventName, { event, port, portName });
        } else {
          const to = await computePortName(event.to);
          postEvent(portMap, to, { event, port, portName });
        }
      });

      port.onDisconnect.addListener(() => {
        portMap.delete(portName);
      });
    });
  };

  const onMessage = ({ withResponse }) => {
    return (eventName, callback) => {
      callbackMap.set(eventName, {
        postMessage: async (event) => {
          const response = await callback(event.eventData, event);

          if (withResponse) {
            event.port.postMessage({
              ...event,
              to: event.from,
              eventName: `${event.eventName}::RESPONSE`,
              eventData: response,
            });
          }
        },
      });
    };
  };

  const sendMessage = ({ withResponse }) => {
    return async (to, eventName, data) => {
      const toPort = await computePortName(to);

      postEvent(portMap, toPort, {
        event: { to, eventName, eventData: data },
        port: {
          name: "background",
          sender: { tab: { type: "background", id: null } },
          postMessage: (eventToPost) => {
            if (portMap.has(eventToPost.from)) {
              portMap.get(eventToPost.from).postMessage(eventToPost);
            }
          },
        },
        portName: "background",
      });

      if (withResponse) {
        return new Promise((resolve) => {
          onMessage(`${eventName}::RESPONSE`, (event) => {
            resolve(event.eventData, event);
          });
        });
      }
    };
  };

  return {
    initMessaging,
    onMessage: onMessage({ withResponse: false }),
    sendMessage: sendMessage({ withResponse: false }),
    onMessageWithResponse: onMessage({ withResponse: true }),
    sendMessageWithResponse: sendMessage({ withResponse: true }),
  };
};
