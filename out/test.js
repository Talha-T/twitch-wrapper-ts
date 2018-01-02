"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const token = "w2ijpi8d0u2486ggh6j6xboh0zfnyl";
const twitch = new index_1.Twitch("implicit1", token, "implicit1");
twitch.connect();
twitch.on("connected", () => console.log("WOHOO!"));
twitch.on("message", (message) => console.log(message.broadcaster));
//# sourceMappingURL=test.js.map