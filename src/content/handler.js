/* eslint-disable prefer-destructuring */
import { getMessagingPort } from "../core/messagingPort";
import { getWindowMessagingPort } from "../core/windowMessagingPort";

const messagingPort = getMessagingPort("content");

const windowMessagingPort = getWindowMessagingPort({
  sendType: "CONTENT_WINDOW",
  reciverType: "CONTENT",
});

export const onMessage = messagingPort.onMessage;
export const sendMessage = messagingPort.sendMessage;
export const sendMessageWithResponse = messagingPort.sendMessageWithResponse;
export const onMessageWithResponse = messagingPort.onMessageWithResponse;

export const onWindowMessage = windowMessagingPort.onMessage;
export const sendToWindow = windowMessagingPort.sendMessage;
