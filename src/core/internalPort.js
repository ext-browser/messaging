/* eslint-disable arrow-body-style */

export const getPort = (name) => {
  const callbackList = [];
  let sendEvent = null;

  const port = {
    name,
    sender: { type: name, tab: { id: null } },
    setSendEvent: (newSendEvent) => {
      sendEvent = newSendEvent;
    },
    postMessage: (eventToPost) => {
      sendEvent({
        ...eventToPost,
        from: name,
        port,
        sender: port.sender,
      });
    },
    postInternalMessage: (eventToPost) => {
      callbackList.forEach((callback) => {
        callback(eventToPost);
      });
    },
    onMessage: {
      addListener: (callback) => {
        callbackList.push(callback);
      },
      removeListener: (callback) => {
        const index = callbackList.indexOf(callback);

        if (index > -1) {
          callbackList.splice(index, 1);
        }
      },
    },
    onDisconnect: {
      addListener: () => {},
      removeListener: () => {},
    },
  };

  return port;
};
