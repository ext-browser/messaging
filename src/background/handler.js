import { getCurrentTab } from "../core/utils";

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

export const initMessaging = () => {
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

export const onMessage = (eventName, callback) => {
  callbackMap.set(eventName, {
    postMessage: async (event) => {
      const response = await callback(event.eventData, event);

      event.port.postMessage({
        ...event,
        to: event.from,
        eventName: `${event.eventName}::RESPONSE`,
        eventData: response,
      });
    },
  });
};

export const sendMessage = async (to, eventName, data) => {
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

  return new Promise((resolve) => {
    onMessage(`${eventName}::RESPONSE`, (event) => {
      resolve(event.eventData, event);
    });
  });
};
