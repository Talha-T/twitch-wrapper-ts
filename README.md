# twitch-wrapper-ts
#### Twitch Chat & API Wrapper for Node.js Typescript
[![NPM](https://nodei.co/npm/twitch-wrapper-ts.png)](https://nodei.co/npm/twitch-wrapper-ts/)
---

### Features:
- Very simple to use, both chat wise and API wise.
- Strongly typed API results.

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

Strongly typed API calls (Fully documented in the Intellisense) :
```ts
import { ApiRequester } from "twitch-wrapper-ts";
const twitchApi = new TwitchApi(clientId, oauth);
const users = await twitchApi.users.get({
    login: "implicit1",
});

const followData = await twitchApi.users.follows.get({
    from_id: users.data[0].id,
});
/*
{ total: 63,
  data:
   [ { fromId: '69056964',
       toId: '30080751',
       followedAt: '2018-02-10T16:52:34Z' },
       ...
   ]
}
*/
```

Error handling:
```ts
try {
    //something
} catch (err) {
    console.log(err.response);
}
// { error: 'Service Unavailable', status: 503, message: '' }
```

### Important Notes.
- Do not include the prefix `oauth:` in your oauth password.
- If you do not have one, get it here: http://twitchapps.com/tmi/
- Including # or not in the channel does NOT matter.
- Currently you can get detailed information in IntelliSense, documententation will be added soon.
- As an exception for the clips endpoint, you have to cast your data from `IClip` as here:
```ts
const clip = await twitchApi.clips.get({
    id: "AwkwardHelplessSalamanderSwiftRage",
});
const clips = clip.data.map((clipV) => clipV as Clip);
console.log(clips[0].embedUrl);
```
- If you cannot make something work, be sure to check the summary comments for it.

### Extra Contact:
Implicit#8954 on Discord, talha6851@hotmail.com
