import { Twitch } from "./index";
import { Message } from "./types/message";

const token: string = "w2ijpi8d0u2486ggh6j6xboh0zfnyl";
const twitch: Twitch = new Twitch("implicit1", token, "ligbot");

twitch.connect();
twitch.on("connected", () => console.log("WOHOO!"));
twitch.on("message", (message: Message) => console.log("content: " + message.content));

