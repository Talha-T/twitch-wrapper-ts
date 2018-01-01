# twitch-wrapper-ts
#### Twitch Chat & API Wrapper for Node.js Typescript
---

### Features:
- Simple to use
- Small
- Easy to extend
- Twitch chat livestream
- (TODO): Twitch API Calls

### Installation:
`npm install twitch-wrapper-ts`

### How to Use:
After installing the package, getting chat is as easy as this:
```js
import { Twitch } from "twitch-wrapper-ts";

const twitch: Twitch = new Twitch("username", "token", "channelnames", "seperated");

twitch.connect();
twitch.on("connected", () => console.log("WOHOO!"));
twitch.on("message", (message : Message) => console.log(`content: ${message.content}`));
```

### Contact:
Implicit#8954 on Discord, or just open an issue.