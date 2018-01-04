# twitch-wrapper-ts
#### Twitch Chat & API Wrapper for Node.js Typescript
[![NPM](https://nodei.co/npm/twitch-wrapper-ts.png)](https://nodei.co/npm/twitch-wrapper-ts/)
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
import { Twitch, Message } from "twitch-wrapper-ts";

const twitch: Twitch = new Twitch("username", "token", "channelnames", "seperated");

twitch.connect();
twitch.on("connected", () => console.log("WOHOO!"));
twitch.on("message", (message : Message) => console.log(message));
/*
Message {
  badges: '',
  color: '#00FF7F',
  displayName: 'kutsalouse',
  emotes: '',
  id: '325003d6-aad3-41c5-aa89-d6ee9c56efd7',
  mod: true,
  roomId: 69223356,
  subscriber: true,
  tmiSentTs: 1515006994874,
  turbo: true,
  userId: 47954587,
  userType: '',
  content: 'drop var alt tab yapma artık',
  channel: '#only35support',
  broadcaster:
   Broadcaster {
     emoteOnly: true,
     followersOnly: -1,
     mercury: true,
     r9k: true,
     rituals: true,
     roomId: 69223356,
     slow: true,
     subsOnly: true,
     broadcasterLang: '' }
}
*/
```

### Contact:
Implicit#8954 on Discord, or just open an issue.