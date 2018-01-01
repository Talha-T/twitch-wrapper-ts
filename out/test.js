"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const token = "w2ijpi8d0u2486ggh6j6xboh0zfnyl";
const twitch = new index_1.default("implicit1", token, "ligbot");
twitch.connect();
twitch.on("connected", () => console.log("WOHOO!"));
twitch.on("message", (message) => console.log("content: " + message.content));
//# sourceMappingURL=test.js.map