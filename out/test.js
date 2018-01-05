"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const token = "3e7rkapy71kmiywlkdcwrb02p0qm6n";
const twitch = new index_1.Twitch("implicit1", token, "implicit1");
twitch.connect();
twitch.on("connected", () => twitch.send("Connected to the channel!", "#implicit1"));
twitch.on("message", (message, channelState) => {
    console.log(message.content);
    console.log(channelState);
});
// twitch.on("channel_user_state", (userState: ChannelUserState) => console.log(userState));
// twitch.on("global_user_state", (userState: GlobalUserState) => console.log(userState));
//# sourceMappingURL=test.js.map