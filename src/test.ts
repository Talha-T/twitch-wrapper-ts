import { Twitch } from "./index";
import { Message, ChannelUserState, GlobalUserState } from "./looseObject";

const token: string = "w2ijpi8d0u2486ggh6j6xboh0zfnyl";
const twitch: Twitch = new Twitch("implicit1", token, "only35support");

twitch.connect();
twitch.on("connected", () => console.log("WOHOO!"));
twitch.on("message", (message: Message) => {
    console.log(message);
});
twitch.on("channel_user_state", (userState: ChannelUserState) => console.log(userState));
twitch.on("global_user_state", (userState: GlobalUserState) => console.log(userState));
