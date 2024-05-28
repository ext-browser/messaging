/* eslint-disable prefer-destructuring */
import { getMessagingPort } from "../core/messagingPort";

const messagingPort = getMessagingPort(`sidepanel`);

export const onMessage = messagingPort.onMessage;
export const sendMessage = messagingPort.sendMessage;
