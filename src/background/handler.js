/* eslint-disable prefer-destructuring */
import { getHandlers } from "../core/backgroundHandlers";
import { getPort } from "../core/internalPort";
import { getMessagingPort } from "../core/messagingPort";

const handlers = getHandlers();

const backgroundPort = getPort("background");

handlers.connectPort(backgroundPort);

const messagingPort = getMessagingPort(backgroundPort.name, backgroundPort);

export const initMessaging = handlers.initMessaging;

export const onMessage = messagingPort.onMessage;
export const sendMessage = messagingPort.sendMessage;
