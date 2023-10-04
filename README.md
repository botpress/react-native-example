# Botpress in React Native

This is a simple example of how to use Botpress in a React Native application. We have two main components: `BpWidget` and `BpIncommingMessagesListener`.

## Installation

To install the necessary dependencies, run the following command:

```bash
npm i
```

## Running the Application

To start the application in development mode, run:

```bash
npm run start
```

## Components

### BpWidget

This component is responsible for rendering the Botpress chat widget in your application. It takes a `botConfig` prop, which is an object containing the configuration for your bot. The `botConfig` object should include the following properties:

- `botId`: The ID of your bot.
- `hostUrl`: The URL where your bot is hosted.
- `messagingUrl`: The URL for your bot's messaging service.
- `clientId`: The client ID for your bot.

The `BpWidget` component also takes a `onMessage` prop, which is a function that will be called whenever a message is received from the bot.

### BpIncommingMessagesListener

This component listens for incoming messages from the bot and can be used from anywhere in the bot, while hidden away. It takes the same `botConfig` prop as the `BpWidget` component, as well as an `onMessage` prop. The `onMessage` function will be called whenever a message is received from the bot.

## Using the Components

In your application, you can use these components as follows:

```jsx
import BpWidget from "./src/BpWidget";
import BpIncommingMessagesListener from "./src/BpIncommingMessagesListener";

const botConfig = {
  botId: "your-bot-id",
  hostUrl: "https://your-bot-host-url",
  messagingUrl: "https://your-bot-messaging-url",
  clientId: "your-bot-client-id",
};

function App() {
  return (
    <View>
      <BpIncommingMessagesListener 
        botConfig={botConfig} 
        onMessage={(message) => console.log('Received message:', message)}
      />
      <BpWidget 
        botConfig={botConfig} 
        onMessage={(message) => console.log('Received message:', message)}
      />
    </View>
  );
}
```

## Interacting with the Bot

The `BpWidget` component exposes three methods that you can use to interact with the bot:

- `sendEvent(event)`: Sends an event to the bot. The `event` parameter should be an object containing the event data.
- `sendPayload(payload)`: Sends a payload to the bot. The `payload` parameter should be an object containing the payload data.
- `mergeConfig(config)`: Merges the given `config` object with the current bot configuration.

You can call these methods using a ref to the `BpWidget` component:

```jsx
const bpWidgetRef = useRef();

// ...

<BpWidget ref={bpWidgetRef} ... />

// ...

bpWidgetRef.current.sendEvent({ type: 'toggle' });
bpWidgetRef.current.sendPayload({ type: 'text', text: 'Hello, bot!' });
bpWidgetRef.current.mergeConfig({ botName: 'New Bot Name' });
```

That's it! You now have a fully functional Botpress chat widget in your React Native application.