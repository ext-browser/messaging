/* eslint-disable arrow-body-style */
import { computePortName } from "./utils";

export const getPort = (name) => {
  const callbackList = [];
  let portMap = null;

  return {
    name,
    sender: { tab: { type: name, id: 1 } },
    setPortMap: (newPortMap) => {
      portMap = newPortMap;
    },
    postMessage: async (eventToPost) => {
      const to = await computePortName(eventToPost.to);

      if (portMap.has(to)) {
        portMap.get(to).postMessage(eventToPost);
      } else {
        // throw error
      }
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
};
