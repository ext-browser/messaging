/* eslint-disable prefer-destructuring */
import { getMessagingPort } from "../core/messagingPort";

const messagingPort = getMessagingPort(`devtool:${chrome.devtools.inspectedWindow.tabId}`);

export const onMessage = messagingPort.onMessage;
export const sendMessage = messagingPort.sendMessage;
