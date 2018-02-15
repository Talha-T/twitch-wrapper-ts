"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const clientId = "7zg5eezlupr0e6n1zj3s0t44wczxyl";
const token = "3e7rkapy71kmiywlkdcwrb02p0qm6n";
const twitch = new index_1.Twitch("implicit1", token, "implicit1");
twitch.connect();
twitch.on("connected", () => twitch.send("Connected to the channel!", "#implicit1"));
twitch.on("message", (message, channelState) => {
    console.log(message.content);
});
twitch.on("channel_user_state", (userState) => console.log(userState));
twitch.on("global_user_state", (userState) => console.log(userState));
const requester = new index_1.ApiRequester(clientId);
function apiCall() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("here!!");
        const result = yield requester.get("/users", {
            login: ["implicit1"],
        });
        console.log(result);
    });
}
apiCall();
//# sourceMappingURL=test.js.map