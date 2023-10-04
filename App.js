import { Button, View } from "react-native";
import BpWidget from "./src/BpWidget";
import BpIncommingMessagesListener from "./src/BpIncommingMessagesListener";
import { useRef } from "react";


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

export default function App() {

 const botpressWebChatRef = useRef();

  const sendExampleEvent = () => {
    botpressWebChatRef.current?.sendEvent({ type: "toggle" });
  }
  const sendExamplePayload = () => {
    botpressWebChatRef.current?.sendPayload({ type: "text", text: "hello" });
  }
  const changeExampleConfig = () => {
    botpressWebChatRef.current?.mergeConfig({ botName: Math.random() });
  }


  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={{ flex: 1 }}>
        <View
          style={{ height: 50, justifyContent: "center", alignItems: "center" }}
        >
          {/* <Text>Your app header or spacer</Text> */}
        </View>
        <BpWidget
          ref={botpressWebChatRef}
          botConfig={testingConfig}
          onMessage={(event) => {
            console.log("event from widget", event);
          }}
        />
        <Button
          onPress={sendExampleEvent}
          title="Toggle webchat"
        />
        <Button
          onPress={changeExampleConfig}
          title="changeConfig"
        />
        <Button
          onPress={sendExamplePayload}
          title="send message"
        />
      </View>
      {/* In case your webchat is not rendered and you want to catch bot messages */}
      <BpIncommingMessagesListener
        botConfig={testingConfig}
        onBotMessage={(event) => {
          console.log("bot message", event);
        }}
      />
    </View>
  );
}
