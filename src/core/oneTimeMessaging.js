// import { getCurrentTab, getAllTabs, isMessageLenghtExceeded, MAX_DATA_SIZE } from "./utils";

// const eventMap = new Map();

// const transferData = async (eventName, eventData) => {
//   const response = await chrome.runtime.sendMessage({
//     eventName,
//     eventData,
//   });

//   if (true) {
//     const currentTab = await getCurrentTab();
//     if (currentTab) {
//       await chrome.tabs.sendMessage(currentTab.id, { eventName, eventData });
//     }
//   } else {
//     const allTabs = await getAllTabs();

//     if (allTabs) {
//       for (let i = 0; i < allTabs.length; i++) {
//         await chrome.tabs.sendMessage(tab.id, { eventName, eventData });
//       }
//     }
//   }
// };

// export const sendMessage = async (eventName, data) => {
//   const dataToSend = JSON.stringify(data);

//   try {
//     await transferData(eventName, { data: dataToSend });
//   } catch (err) {
//     if (isMessageLenghtExceeded(err.message)) {
//       const chunkCount = Math.ceil(dataToSend.length / MAX_DATA_SIZE);

//       for (let i = 0; i < chunkCount; i++) {
//         const params = {
//           split: "chunk",
//           chunk: i,
//           data: dataToSend.slice(i * MAX_DATA_SIZE, (i + 1) * MAX_DATA_SIZE),
//         };
//         await transferData(eventName, params);
//       }

//       await transferData(eventName, {
//         split: "end",
//       });
//     } else {
//       console.error(err);
//     }
//   }
// };

// export const onMessage = (eventName, callback) => {
//   let chunks = [];

//   const cb = (request, sender, sendResponse) => {
//     if (request.eventName === eventName) {
//       let { data, split } = request.eventData;
//       let dataToUse = data;

//       if (split === "chunk") {
//         chunks.push(data);
//         return;
//       }

//       if (split === "end") {
//         dataToUse = chunks.join("") || "{}";
//         chunks = [];
//       }

//       callback(JSON.parse(dataToUse), sender);
//     }
//   };

//   chrome.runtime.onMessage.addListener(cb);

//   eventMap.set(callback, cb);
// };

// export const removeOnMessageHandler = (callback) => {
//   const cb = eventMap.get(callback);

//   if (cb) {
//     chrome.runtime.onMessage.removeListener(cb);
//   }
// };

// export const sendToContentFromWeb = (eventName, data) => {
//   window.postMessage(
//     {
//       type: "TYPE",
//       eventName,
//       data: JSON.stringify(data),
//     },
//     "*",
//   );
// };

// export const onMessageOnContentFromWeb = (eventName, callback) => {
//   window.addEventListener("message", function (event) {
//     if (event.source != window) return;

//     if (event?.data?.type === "TYPE" && event?.data.eventName === eventName) {
//       const parsedData = JSON.parse(event.data?.data);

//       if (callback.TYPE === "TO_WEB") {
//         callback(eventName, parsedData);
//       } else {
//         callback(parsedData);
//       }
//     }
//   });
// };

// export const passMessageFromWeb = (eventName, eventData) => {
//   sendMessage(eventName, eventData);
// };

// passMessageFromWeb.TYPE = "TO_WEB";
