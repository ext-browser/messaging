/* eslint-disable arrow-body-style */

export const getWindowMessagingPort = ({ sendType, reciverType }) => {
  return {
    onMessage: (eventName, callback) => {
      window.addEventListener("message", (event) => {
        if (event.source != window) return;

        if (
          event?.data?.type === reciverType &&
          event?.data.eventName === eventName
        ) {
          const parsedData = event.data?.eventData;

          callback(parsedData, event);
        }
      });
    },
    sendMessage: (eventName, data) => {
      const eventData = data;

      window.postMessage(
        {
          type: sendType,
          eventName,
          eventData,
        },
        "*",
      );
    },
  };
};
