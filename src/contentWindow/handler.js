import { getWindowHandlers } from "../core/windowHandlers";

const windowMessagingPort = getWindowHandlers({
  sendType: "CONTENT",
  reciverType: "CONTENT_WINDOW",
});

export const sendMessage = windowMessagingPort.sendMessage;
export const onMessage = windowMessagingPort.onMessage;
