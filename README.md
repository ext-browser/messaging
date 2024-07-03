# Documentation
[Messaging Documentation](https://ext-browser.github.io/messaging/intro)

# Concept

The Messaging library empowers seamless communication between various components that make up your browser extension. Here's a breakdown of supported components and how they interact through Messaging:

## Import

To utilize Messaging within a component, import the necessary functions using clear naming conventions:

```js
import { onMessage, sendMessage } from "@ext-browser/messaging/{{extensionComponent}}";
```

#### ExtensionComponent

Below are supported `extensionComponent`

- `background`
- `content:{tabId}` (Broswer Tab Id)
- `contentWindow` (With Special Handling See Below)
- `devtools:{tabId}` (Broswer Tab Id)
- `popup`
- `sidepanel`

Each supported component provides two essential functions for communication:

### onMessage(`eventName`, `callback`)
Registers a listener function (callback) that is invoked whenever a message with the specified eventName is received from any component. The callback function typically receives the message data as an argument.

```js
import { onMessage } from "@ext-browser/messaging/popup";

onMessage("EXTENSION_SETTINGS_UPDATED", async (data) => {
    return { settings: true };
})

```

### sendMessage(`extensionComponent`, `eventName`, `data`)
Sends a message to a specific component identified by recipient. The eventName acts as a message identifier, and the data parameter carries the information you want to transmit.

```js
import { sendMessage } from "@ext-browser/messaging/background";

const response = await sendMessage("popup", "EXTENSION_SETTINGS_UPDATED", { theme: "dark" })

```


## contentWindow


The Messaging library empowers seamless communication within your browser extension. However, content scripts injected with ExecutionWorld.ISOLATED present a unique challenge due to their separation from the main window environment. To bridge this gap, the library provides two communication methods:


### Bridging the Gap with `onWindowMessage`

- ### Content Script (Isolated)
    - Listen for messages from the main window using `onWindowMessage`.
    - Forward it to other extension component using `sendMessage`.
    - Send message to window content using `sendToWindow`.

```js title="./content-script-isolated.js"
import { sendMessage, sendToWindow, onMessage, onWindowMessage } from "@ext-browser/messaging/content";

// Send data to the main content script (ExecutionWorld.MAIN)
sendToWindow("EVENT", { key: true });

// Listen for events from the main content script
onWindowMessage("BUTTON_CLICKED", (data) => {
    // Forward the event to other components (e.g., popup)
    sendMessage("popup", "BUTTON_CLICKED", data);
});
```

- ### Content Script (Main)
    - Listen for messages originating from isolated content scripts using `onMessage`.
    - Send message to isolated content using `sendMessage`.


```js title="./content-script-main.js"
import { sendMessage, onMessage } from "@ext-browser/messaging/contentWindow";

// Listen for messages from isolated content scripts
onMessage("EVENT", (data) => {
    // Process the data or forward it to other components
    console.log("Received event from isolated script:", data);
});

document.getElementById("btn").addEventListener("click", () => {
    sendMessage("popup", "BUTTON_CLICKED", { btn: "my-button" });
});
```

**Security:** Be mindful of security implications when relaying messages through the main content script. Ensure proper data validation and sanitization to prevent potential vulnerabilities.
