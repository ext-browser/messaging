/* eslint-disable prefer-destructuring */
import { getHandlers } from "../core/backgroundHandlers";

const messagingPort = getHandlers();

export const initMessaging = messagingPort.initMessaging;
export const onMessage = messagingPort.onMessage;
export const sendMessage = messagingPort.sendMessage;
export const sendMessageWithResponse = messagingPort.sendMessageWithResponse;
export const onMessageWithResponse = messagingPort.onMessageWithResponse;
