/* eslint-disable arrow-body-style */
import { computePortName } from "./utils";

export const getHandlers = () => {
  const portMap = new Map();

  const initMessaging = () => {
    chrome.runtime.onConnect.addListener((port) => {
      let portName = port.name;

      if (portName === "content") {
        portName = `${portName}:${port.sender.tab.id}`;
      }

      portMap.set(portName, port);

      port.onMessage.addListener(async (event) => {
        const to = await computePortName(event.to);
        const eventParams = {
          ...event,
          event,
          from: portName,
          port,
          sender: port.sender,
        };

        if (portMap.has(to)) {
          if (portMap.get(to).postInternalMessage) {
            portMap.get(to).postInternalMessage(eventParams);
          } else {
            portMap.get(to).postMessage(eventParams);
          }
        }
      });

      port.onDisconnect.addListener(() => {
        portMap.delete(portName);
      });
    });
  };

  const setPort = (portName, port) => {
    portMap.set(portName, port);
    if (port.setPortMap) {
      port.setPortMap(portMap);
    }
  };

  return {
    initMessaging,
    setPort,
  };
};
