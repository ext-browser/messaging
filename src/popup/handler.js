/* eslint-disable prefer-destructuring */
import { getHandlers } from "../core/handler";

const messagingPort = getHandlers(`popup`);

export const onMessage = messagingPort.onMessage;
export const sendMessage = messagingPort.sendMessage;
