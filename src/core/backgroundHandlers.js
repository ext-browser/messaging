/* eslint-disable arrow-body-style */
import { computePortName } from "./utils";

export const getHandlers = () => {
  const portMap = new Map();

  const onConnect = (port, { onPortDisconnect, onPortConnect } = {}) => {
    let portName = port.name;

    if (portName === "content") {
      portName = `${portName}:${port.sender.tab.id}`;
    }

    const tabId = portName.includes(":") ? portName.split(":")[1] : null;

    portMap.set(portName, port);

    const sendEvent = async (event) => {
      const to = await computePortName(event.to);
      const eventToSend = {
        ...event,
        event,
        from: portName,
        fromTabId: tabId,
        port,
        sender: port.sender,
      };

      if (portMap.has(to)) {
        if (portMap.get(to).postInternalMessage) {
          portMap.get(to).postInternalMessage(eventToSend);
        } else {
          portMap.get(to).postMessage(eventToSend);
        }
      } else {
        eventToSend.port.postMessage({
          ...eventToSend,
          to: eventToSend.from,
          eventName: `${eventToSend.eventName}::RESPONSE_ERROR`,
          eventData: `Port not found: ${to}`,
        });
      }
    };

    if (port.isInternalPort) {
      port.setSendEvent(sendEvent);
    } else {
      port.onMessage.addListener(sendEvent);

      port.onDisconnect.addListener(() => {
        portMap.delete(portName);
        if (onPortDisconnect) {
          onPortDisconnect({ portName, port, originPortName: port.name, tabId });
        }
      });
    }

    if(onPortConnect) {
      onPortConnect({ portName, port, originPortName: port.name, tabId });
    }
  };

  const initMessaging = ({ onPortDisconnect, onPortConnect } = {}) => {
    chrome.runtime.onConnect.addListener((port) => onConnect(port, { onPortDisconnect, onPortConnect }));
  };

  return {
    initMessaging,
    connectPort: onConnect,
  };
};
