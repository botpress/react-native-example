import { WebView } from "react-native-webview";
import getBotpressWebchat from "./getBotpressWebchat";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

const broadcastAllNotifications = `
window.botpressWebChat.onEvent(
  (event) => {
    window.ReactNativeWebView.postMessage(JSON.stringify(event));
  },
  ['*']
);

true; // note: this is required, or you'll sometimes get silent failures
`;

const BpWidget = forwardRef((props, ref) => {
  const webref = useRef();

  const { botConfig, onMessage } = props;

  const { html, baseUrl } = getBotpressWebchat(botConfig);

    const invokeBotpressMethod = (method, ...args) => {
    if (!webref.current) {
      throw new Error("Webview must be loaded to run commands");
    }
    const run = `
    window.botpressWebChat.${method}(${args
      .map((arg) => JSON.stringify(arg))
      .join(",")});
    true;
    `;
    webref.current.injectJavaScript(run);
  };

  // Expose sendEvent method with react ref
  useImperativeHandle(ref, () => ({
    sendEvent: (event) => {
      invokeBotpressMethod("sendEvent", event);
    },
    sendPayload: (payload) => {
      invokeBotpressMethod("sendPayload", payload);
    },
    mergeConfig: (config) => {
      invokeBotpressMethod("mergeConfig", config);
    },
  }));
  
  return (
    <WebView
      ref={webref}
      style={{ flex: 1 }}
      source={{
        baseUrl,
        html,
      }}
      onMessage={onMessage}
      injectedJavaScript={broadcastAllNotifications}
    />
  );
});

export default BpWidget;
