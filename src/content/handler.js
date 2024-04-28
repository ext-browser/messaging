/* eslint-disable prefer-destructuring */
import { getHandlers } from "../core/handler";
import { getWindowHandlers } from "../core/windowHandlers";

const messagingPort = getHandlers("content");

const windowMessagingPort = getWindowHandlers({
  sendType: "CONTENT_WINDOW",
  reciverType: "CONTENT",
});

export const onMessage = messagingPort.onMessage;
export const sendMessage = messagingPort.sendMessage;
export const onWindowMessage = windowMessagingPort.onMessage;
export const sendToWindow = windowMessagingPort.sendMessage;
