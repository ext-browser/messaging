/* eslint-disable prefer-destructuring */
import { getHandlers } from "../core/handler";

const messagingPort = getHandlers(`devtool:${chrome.devtools.inspectedWindow.tabId}`);

export const onMessage = messagingPort.onMessage;
export const sendMessage = messagingPort.sendMessage;
export const sendMessageWithResponse = messagingPort.sendMessageWithResponse;
export const onMessageWithResponse = messagingPort.onMessageWithResponse;
