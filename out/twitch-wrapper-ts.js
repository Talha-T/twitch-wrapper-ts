"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws = require("ws");
const parser_1 = require("./parser");
const Dictionary_1 = require("typescript-collections/dist/lib/Dictionary");
const events_1 = require("events");
const parser = new parser_1.Parser;
/**
 * The main class for accessing Twitch
 */
class Twitch extends events_1.EventEmitter {
    /**
     * Constructs Twitch class. This needs a username and oauth password.
     * If you don't have an oauth password, get it here: https://twitchapps.com/tmi/
     * @param userName Username for the bot.
     * @param password Oauth password for the bot.
     * @param channels Channels for bot to work on.
     */
    constructor(userName, password, ...channels) {
        super();
        this.chatServer = new ws("wss://irc-ws.chat.twitch.tv:443/irc");
        /**
         * List of broadcasters. <channelString, Broadcaster>
         */
        this.broadcasters = new Dictionary_1.default();
        this.selves = new Dictionary_1.default();
        this.user = userName;
        this.oAuth = password;
        this.channels = channels;
    }
    /**
     * Listen to an event with a callback.
     * Current supported events:
     * - connected
     * - message
     * - global_user_state
     * - channel_user_state
     * @param event The event to listen to
     * @param listener The handler of the event
     */
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    /**
     * Connects twitch client.
     */
    connect() {
        const that = this; // store this into variable, this changes in javascript
        this.chatServer.onopen = function () {
            // pass required parameters into websocket
            that.chatServer.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
            that.chatServer.send(`PASS oauth:${that.oAuth}`);
            that.chatServer.send(`NICK ${that.user}`);
            that.channels.forEach(channel => that.chatServer.send(`JOIN #${channel.replace("#", "").toLowerCase()}`)); // if channel has #, remove it ; also, lowercase the channel otherwise twitch doesn't work.
            that.chatServer.send(`USER ${that.user}`);
            // chatServer.send("PRIVMSG #implicit1 :This is a sample message");
        };
        this.chatServer.onmessage = function (event) {
            const message = event.data.toString();
            if (message.includes("Login authentication failed")) {
                throw new Error("Login authentication failed");
            }
            if (message.includes("Welcome, GLHF!")) {
                that.emit("connected");
            }
            else if (message.startsWith("@broadcaster")) {
                const broadcaster = parser.parseBroadcaster(message);
                that.broadcasters.setValue(broadcaster[1], broadcaster[0]);
            }
            else if (message.includes("PRIVMSG")) {
                const messageData = parser.parseMessage(message);
                messageData.broadcaster = that.broadcasters.getValue(messageData.channel);
                that.emit("message", messageData);
            }
            else if (message === "PING :tmi.twitch.tv") {
                that.chatServer.send("PONG :tmi.twitch.tv");
            }
            else if (message.includes("USERSTATE")) {
                if (message.includes("GLOBALUSERSTATE")) {
                    const userState = parser.parseGlobalUserState(message);
                    that.globalSelf = userState;
                    that.emit("global_user_state", userState);
                }
                else {
                    const userState = parser.parseChannelUserState(message);
                    that.selves.setValue(userState.channel, userState);
                    that.emit("channel_user_state", userState);
                }
            }
        };
        this.chatServer.onerror = function (err) {
            throw err;
        };
    }
}
exports.Twitch = Twitch;
//# sourceMappingURL=twitch-wrapper-ts.js.map