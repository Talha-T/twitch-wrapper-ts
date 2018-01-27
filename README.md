# twitch-wrapper-ts
#### Twitch Chat & API Wrapper for Node.js Typescript
[![NPM](https://nodei.co/npm/twitch-wrapper-ts.png)](https://nodei.co/npm/twitch-wrapper-ts/)
---

### Features:
- Simple to use
- Small
- Easy to extend
- Twitch chat livestream
- Twitch API Calls
- TODO: Twitch Response Types

### Installation:
`npm install twitch-wrapper-ts`

### How to Use:
After installing the package, getting chat is as easy as this:
```js
import { Twitch, Message, ChannelUserState } from "twitch-wrapper-ts";

const twitch: Twitch = new Twitch("username", "token", "channelnames", "seperated");

twitch.connect();
twitch.on("connected", () => twitch.send("Connected!!", "somechannel"));
twitch.on("message", (message: Message, channelState: ChannelUserState) => console.log(message));
    
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

Api Calls (types not yet implemented):
```js
const result: any = await requester.get<any>("/users", {
    login: ["implicit1"]
});
console.log(result);
/*
{ _total: 1,
  users:
   [ { display_name: 'implicit1',
       _id: '69056964',
       name: 'implicit1',
       type: 'user',
       bio: null,
       created_at: '2014-08-15T17:41:08.724835Z',
       updated_at: '2018-01-05T20:03:12.090905Z',
       logo: 'https://static-cdn.jtvnw.net/user-default-pictures/cd618d3e-f14d-4960-b7cf-094231b04735-profile_image-300x300.jpg' }
] }
*/
```

### Important Notes.
- Do not include the prefix `oauth:` in your oauth password.
- If you do not have one, get it here: http://twitchapps.com/tmi/
- Including # or not in the channel does NOT matter.
- Currently you can get detailed information in IntelliSense, documententation will be added soon.

### Contact:
Implicit#8954 on Discord, or just open an issue.
