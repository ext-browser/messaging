import { getCurrentTab } from "../core/utils";

const portMap = new Map();
const callbackMap = new Map();

export const initMessaging = () => {
  chrome.runtime.onConnect.addListener((port) => {
    let portName = port.name;

    if (portName === "content") {
      portName = `${portName}:${port.sender.tab.id}`;
    }

    portMap.set(portName, port);

    port.onMessage.addListener(async (event) => {
      if (event.to === "background") {
        if (callbackMap.has(event.eventName)) {
          callbackMap.get(event.eventName)(event.eventData, {
            event,
            port,
            sender: port.sender,
            senderTab: port.sender.tab,
          });
        }
      } else if (event.to.includes(":")) {
        const [to, tabId] = event.to.split(":");

        if (tabId === "active") {
          const tab = await getCurrentTab();
          if (portMap.has(`${to}:${tab.id}`)) {
            portMap.get(`${to}:${tab.id}`).postMessage(event);
          }
        } else if (portMap.has(event.to)) {
          portMap.get(event.to).postMessage(event);
        }
      } else if (portMap.has(event.to)) {
        portMap.get(event.to).postMessage(event);
      }
    });
  });
};

export const onMessage = (eventName, callback) => {
  callbackMap.set(eventName, callback);
};

export const sendMessage = (to, eventName, data) => {
  if (portMap.has(to)) {
    const eventData = data;

    portMap.get(to).postMessage({ to, eventName, eventData });
  }
};
