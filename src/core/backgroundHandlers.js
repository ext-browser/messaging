/* eslint-disable arrow-body-style */
import { computePortName } from "./utils";

export const getHandlers = () => {
  const portMap = new Map();

  const sendEvent = async (event) => {
    const to = await computePortName(event.to);
    if (portMap.has(to)) {
      if (portMap.get(to).postInternalMessage) {
        portMap.get(to).postInternalMessage(event);
      } else {
        portMap.get(to).postMessage(event);
      }
    } else {
      event.port.postMessage({
        ...event,
        to: event.from,
        eventName: `${event.eventName}::RESPONSE_ERROR`,
        eventData: "Port not found",
      });
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
        sendEvent({
          ...event,
          event,
          from: portName,
          port,
          sender: port.sender,
        });
      });

      port.onDisconnect.addListener(() => {
        portMap.delete(portName);
      });
    });
  };

  const setPort = (portName, port) => {
    portMap.set(portName, port);
    if (port.setSendEvent) {
      port.setSendEvent(sendEvent);
    }
  };

  return {
    initMessaging,
    setPort,
  };
};
