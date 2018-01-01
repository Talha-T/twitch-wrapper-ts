"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws = require("ws");
const parser_1 = require("./parser");
const broadcaster_1 = require("./types/broadcaster");
const events_1 = require("events");
const parser = new parser_1.Parser;
class Twitch extends events_1.EventEmitter {
    constructor(userName, password, ...channels) {
        super();
        this.chatServer = new ws("wss://irc-ws.chat.twitch.tv:443/irc");
        this.user = userName;
        this.oAuth = password;
        this.channels = channels;
    }
    connect() {
        const that = this; // store this into variable, this changes in javascript
        this.chatServer.onopen = function () {
            that.chatServer.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
            that.chatServer.send(`PASS oauth:${that.oAuth}`);
            that.chatServer.send(`NICK ${that.user}`);
            that.channels.forEach(channel => that.chatServer.send(`JOIN #${channel.replace("#", "").toLowerCase()}`)); // if channel has #, remove it ; also, lowercase the channel otherwise twitch doesn't work.
            that.chatServer.send(`USER ${that.user}`);
            // chatServer.send("PRIVMSG #implicit1 :This is a sample message");
        };
        this.chatServer.onmessage = function (event) {
            const message = event.data.toString();
            if (message.startsWith(":tmi.twitch.tv NOTICE * :Login authentication failed")) {
                throw new Error("Login authentication failed");
            }
            if (message.startsWith(":tmi.twitch.tv 001 implicit1 :Welcome, GLHF!")) {
                that.emit("connected");
            }
            else if (message.startsWith("@broadcaster")) {
                const broadcaster = parser.parseObject(message, new broadcaster_1.Broadcaster());
                // console.log(broadcaster);
            }
            else if (message.includes("PRIVMSG")) {
                that.emit("message", parser.parseMessage(message));
            }
            else if (message === "PING :tmi.twitch.tv") {
                that.chatServer.send("PONG :tmi.twitch.tv");
            }
            console.log("MSG: " + message);
        };
        this.chatServer.onerror = function (err) {
            throw err;
        };
    }
}
exports.default = Twitch;
/*
    https://api.twitch.tv/api/oauth2/token
    ?client_id=7zg5eezlupr0e6n1zj3s0t44wczxyl
    &client_secret=x77xj5kcnhaaddpx0opsi5vwu4ep1e
    &code=g88tbdnczsqxig5hnnikjn3mmrp3ze
    &grant_type=authorization_code
    &redirect_uri=http://localhost

    https://api.twitch.tv/kraken/oauth2/authorize
    ?client_id=7zg5eezlupr0e6n1zj3s0t44wczxyl
    &redirect_uri=http://localhost
    &response_type=code
    &scope=chat_login
*/ 
//# sourceMappingURL=index.js.map