/* eslint-disable prefer-destructuring */
import { getMessagingPort } from "../core/messagingPort";

const messagingPort = getMessagingPort(`sidepanel`);

export const onMessage = messagingPort.onMessage;
export const sendMessage = messagingPort.sendMessage;
export const sendMessageWithResponse = messagingPort.sendMessageWithResponse;
export const onMessageWithResponse = messagingPort.onMessageWithResponse;
