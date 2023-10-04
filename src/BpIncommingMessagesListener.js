import { View } from "react-native";
import { WebView } from "react-native-webview";
import getBotpressWebchat from "./getBotpressWebchat";

const broadcastBotMessages = `  
window.botpressWebChat.onEvent(
  (event) => {
    window.ReactNativeWebView.postMessage(JSON.stringify(event));
  },
  ['MESSAGE_RECEIVED']
);
true; // note: this is required, or you'll sometimes get silent failures
`;

export default function BpIncommingMessagesListener(props) {
  const { botConfig, onMessage } = props;

  const { html, baseUrl } = getBotpressWebchat(botConfig, false);

  return (
    <View style={{ position: "absolute", top: 0, left: 0 }}>
      <WebView
        source={{
          baseUrl,
          html,
        }}
        onBotMessage={onMessage}
        injectedJavaScript={broadcastBotMessages}
      />
    </View>
  );
}
