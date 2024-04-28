/* eslint-disable arrow-body-style */

export const getWindowHandlers = ({ sendType, reciverType }) => {
  return {
    onMessage: (eventName, callback) => {
      window.addEventListener("message", (event) => {
        if (event.source != window) return;

        if (
          event?.data?.type === reciverType &&
          event?.data.eventName === eventName
        ) {
          const parsedData = JSON.parse(event.data?.eventData);

          callback(parsedData);
        }
      });
    },
    sendMessage: (eventName, data) => {
      const eventData = JSON.stringify(data);

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
