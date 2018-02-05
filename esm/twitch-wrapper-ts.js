var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from "events";
import { Parser } from "./parser";
import { formatChannelName } from "./utils";
const parser = new Parser();
/**
 * Loosen event handler typings somewhat.
 * @param ws an instance of an class which implements the WebSocket spec
 */
function asMinimalWebSocket(ws) { return ws; }
/**
 * Create a native WebSocket if available, otherwise load ws lib.
 */
const createWebSocket = typeof WebSocket !== "undefined"
    ? (url) => Promise.resolve(asMinimalWebSocket(new WebSocket(url)))
    : ((wsP) => (url) => wsP.then((ws) => asMinimalWebSocket(new ws(url))))(import("ws"));
/**
 * Throws TypeError when the value is `null` or `undefined`.
 * @param obj value to assert
 */
function notNull(obj) {
    if (obj === null || obj === undefined) {
        throw new TypeError("Unexpected null or undefined.");
    }
    return obj;
}
/**
 * The main class for accessing Twitch
 */
export class Twitch extends EventEmitter {
    /**
     * Constructs Twitch class. This needs a username and oauth password.
     * If you don't have an oauth password, get it here: https://twitchapps.com/tmi/
     * @param userName Username for the bot.
     * @param password Oauth password for the bot. Do NOT include the prefix `oauth:`
     * @param channels Channels for bot to work on.
     */
    constructor(userName, password, ...channels) {
        super();
        /**
         * List of broadcasters. <channelString, Broadcaster>
         */
        this.broadcasters = new Map();
        this.selves = new Map();
        this.user = userName;
        this.oAuth = password;
        this.channels = channels;
        this.chatServer = createWebSocket("wss://irc-ws.chat.twitch.tv:443/irc");
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
        return __awaiter(this, void 0, void 0, function* () {
            const chatServer = yield this.chatServer;
            chatServer.onopen = () => {
                // pass required parameters into websocket
                chatServer.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
                chatServer.send(`PASS oauth:${this.oAuth}`);
                chatServer.send(`NICK ${this.user}`);
                for (const channel of this.channels) {
                    // if channel has #, remove it ; also, lowercase the channel otherwise twitch doesn't work.
                    chatServer.send(`JOIN ${formatChannelName(channel)}`);
                }
                chatServer.send(`USER ${this.user}`);
            };
            chatServer.onmessage = (event) => {
                const message = event.data.toString();
                if (message.includes("Login authentication failed")) {
                    throw new Error("Login authentication failed");
                }
                if (message.includes("Welcome, GLHF!")) {
                    this.emit("connected");
                }
                else if (message.startsWith("@broadcaster")) {
                    const broadcaster = parser.parseBroadcaster(message);
                    this.broadcasters.set(broadcaster[1], broadcaster[0]);
                }
                else if (message.includes("PRIVMSG")) {
                    const messageData = parser.parseMessage(message);
                    messageData.broadcaster = notNull(this.broadcasters.get(messageData.channel));
                    const channelState = notNull(this.selves.get(messageData.channel));
                    this.emit("message", messageData, channelState);
                }
                else if (message === "PING :tmi.twitch.tv") {
                    chatServer.send("PONG :tmi.twitch.tv");
                }
                else if (message.includes("USERSTATE")) {
                    if (message.includes("GLOBALUSERSTATE")) {
                        const userState = parser.parseGlobalUserState(message);
                        this.globalSelf = userState;
                        this.emit("global_user_state", userState);
                    }
                    else {
                        const userState = parser.parseChannelUserState(message);
                        this.selves.set(userState.channel, userState);
                        this.emit("channel_user_state", userState);
                    }
                }
            };
            chatServer.onerror = (err) => {
                throw err;
            };
        });
    }
    /**
     * Sends given message to the channel
     * @param message What content you want to send
     * @param channel Channel you want to send. Using # doesn't matter.
     */
    send(message, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.chatServer).send(`PRIVMSG ${formatChannelName(channel)} :${message}`);
        });
    }
}
//# sourceMappingURL=twitch-wrapper-ts.js.map