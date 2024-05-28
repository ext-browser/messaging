import { getWindowMessagingPort } from "../core/windowMessagingPort";

const windowMessagingPort = getWindowMessagingPort({
  sendType: "CONTENT",
  reciverType: "CONTENT_WINDOW",
});

export const sendMessage = windowMessagingPort.sendMessage;
export const onMessage = windowMessagingPort.onMessage;
