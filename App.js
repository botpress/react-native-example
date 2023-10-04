import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

// how to use (ideal) : 
// import { BpIncommingMessagesListener, BpWidget } from "bp-devrel/bp-reactnative";

// const App = () => {
//   const useBpWidgetRef = useRef();
//   bpWidgetRef.sendEvent();
//   bpWidgetRef.sendPayload();
//   bpWidgetRef.mergeConfig();

//   return (
//     <View>
//       <BpIncommingMessagesListener botId={botId} onMessage={(message) => {console.log('message')}} />
//       <BpWidget botConfig={botConfig} ref={useBpWidgetRef} />
//     </View>
//   );
// };

const testingConfig = {
  composerPlaceholder: "Chat with bot",
  botConversationDescription:
    "This chatbot was built surprisingly fast with Botpress",
  botId: "db76fba1-82ca-4a9c-ba4d-d4ac245fcdc6",
  hostUrl: "https://cdn.botpress.cloud/webchat/v1",
  messagingUrl: "https://messaging.botpress.cloud",
  clientId: "db76fba1-82ca-4a9c-ba4d-d4ac245fcdc6",
  lazySocket: true,
  frontendVersion: "v1",
  showPoweredBy: true,
  hideWidget: true,
  disableAnimations: true,
  closeOnEscape: false,
  showConversationsButton: false,
  enableTranscriptDownload: false,
  className: "webchatIframe",
  containerWidth: "100%25",
  layoutWidth: "100%25",
  showCloseButton: false,
};
const baseUrl = `https://mediafiles.botpress.cloud/${testingConfig.botId}/webchat/bot.html`;
const html = `<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1 viewport-fit=cover, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
    body {
      margin: 0 auto;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    #bp-web-widget-container {
      height: 100%;
      width: 100%;
      margin: auto;
      flex-grow: 1;
    }
    #bp-web-widget-container div {
      height: 100%;
    }
    .webchatIframe {
      position: relative !important;
    }
  </style>
  <title>Chatbot</title>
</head>
<body>

<script src="https://cdn.botpress.cloud/webchat/v1/inject.js"></script>
<script>
window.botpressWebChat.init(${JSON.stringify(testingConfig)});
window.botpressWebChat.onEvent(function () { window.botpressWebChat.sendEvent({ type: 'show' }) }, ['LIFECYCLE.LOADED']);

</script>

</body>
</html>`;

export default function App() {
  const getNewMessageNotifications = `  
  window.botpressWebChat.onEvent(
    (event) => {
      window.ReactNativeWebView.postMessage(JSON.stringify(event));
    },
    ['MESSAGE.RECEIVED']
  );
  true; // note: this is required, or you'll sometimes get silent failures
`;

  const getOtherNotifications = `
window.botpressWebChat.onEvent(
  (event) => {
    if (event.type === 'MESSAGE.RECEIVED') {
      return;
    }
    window.ReactNativeWebView.postMessage(JSON.stringify(event));
  },
  ['*']
);

true; // note: this is required, or you'll sometimes get silent failures
`;
  const invokeBotpressMethod = (method, ...args) => {
    if (!this.webref) {
      throw new Error("Webview must be loaded to run commands");
    }
    const run = `
  window.botpressWebChat.${method}(${args
      .map((arg) => JSON.stringify(arg))
      .join(",")});
  true;
  `;
    this.webref.injectJavaScript(run);
  };

  // add to hook
  const sendEvent = (event) => {
    invokeBotpressMethod("sendEvent", event);
  };
  // add to hook
  const sendPayload = (payload) => {
    invokeBotpressMethod("sendPayload", payload);
  };
  // add to hook
  const mergeConfig = (config) => {
    invokeBotpressMethod("mergeConfig", config);
  };

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={{ flex: 1 }}>
        <View style={{height: 50, justifyContent:"center", alignItems:"center"}}>
          {/* <Text>Your app header or spacer</Text> */}
        </View>
        <WebView
          ref={(r) => (this.webref = r)}
          style={{ flex: 1 }}
          source={{
            baseUrl,
            html,
          }}
          onMessage={(event) => {
            const data = JSON.parse(event.nativeEvent.data);
            console.log("Event from widget!", data);
          }}
          injectedJavaScript={getOtherNotifications}
        />
        <Button
          onPress={() => {
            sendEvent({ type: "toggle" });
          }}
          title="Toggle webchat"
        />
        <Button
          onPress={() => {
            mergeConfig({ botName: Math.random() });
          }}
          title="changeConfig"
        />
        <Button
          onPress={() => {
            sendPayload({type:'text', text: Math.random() });
          }}
          title="send message"
        />
        
      </View>
      <View style={{ position: "absolute", top: 0, left: 0 }}>
        <WebView
          source={{
            baseUrl,
            html: html.replace(
              "window.botpressWebChat.onEvent(function () { window.botpressWebChat.sendEvent({ type: 'show' }) }, ['LIFECYCLE.LOADED']);",
              ""
            ),
          }}
          onMessage={(event) => {
            const data = JSON.parse(event.nativeEvent.data);
            console.log("Event from Provider!", data);
          }}
          injectedJavaScript={getNewMessageNotifications}
        />
      </View>
    </View>
  );
}
