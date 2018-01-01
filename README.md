# Twitch.ts
#### Twitch Chat & API Wrapper for Node.js Typescript
---

### Features:
- Simple to use
- Small
- Easy to extend
- Twitch chat livestream
- (TODO): Twitch API Calls

### Installation:
`npm install Twitch.ts`

### How to Use:
After installing the package, getting chat is as easy as this:
```js
import Twitch from "Twitch.ts";

const twitch: Twitch = new Twitch("username", "token", "channelnames", "seperated");

twitch.connect();
twitch.on("connected", () => console.log("WOHOO!"));
twitch.on("message", (message) => console.log(`content: ${message.content}`));
```

### Contact:
Implicit#8954 on Discord, or just open an issue.