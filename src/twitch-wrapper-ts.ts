import * as ws from "ws";
import { Data } from "ws";
import { Parser } from "./parser";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { EventEmitter } from "events";
import { Broadcaster, Message, GlobalUserState, ChannelUserState, UserState } from "./looseObject";
import { formatChannelName } from "./utils";
const parser: Parser = new Parser;

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
    constructor(userName: string, password: string, ...channels: string[]) {
        super();
        this.user = userName;
        this.oAuth = password;
        this.channels = channels;
    }

    user: string;
    oAuth: string;
    channels: string[];
    chatServer: ws = new ws("wss://irc-ws.chat.twitch.tv:443/irc");

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
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }
    /**
     * List of broadcasters. <channelString, Broadcaster>
     */
    broadcasters: Dictionary<string, Broadcaster> = new Dictionary<string, Broadcaster>();
    selves: Dictionary<string, ChannelUserState> = new Dictionary<string, ChannelUserState>();
    globalSelf: GlobalUserState;
    /**
     * Connects twitch client.
     */
    connect(): void {
        const that: Twitch = this; // store this into variable, this changes in javascript
        this.chatServer.onopen = function (): any {
            // pass required parameters into websocket
            that.chatServer.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
            that.chatServer.send(`PASS oauth:${that.oAuth}`);
            that.chatServer.send(`NICK ${that.user}`);
            that.channels.forEach(channel =>
                that.chatServer.send(`JOIN ${formatChannelName(channel)}`)
            ); // if channel has #, remove it ; also, lowercase the channel otherwise twitch doesn't work.
            that.chatServer.send(`USER ${that.user}`);
        };

        this.chatServer.onmessage = function (event: { data: ws.Data, type: string, target: ws }): any {
            const message: string = event.data.toString();
            if (message.includes("Login authentication failed")) {
                throw new Error("Login authentication failed");
            }
            if (message.includes("Welcome, GLHF!")) { // default connect message
                that.emit("connected");
            } else if (message.startsWith("@broadcaster")) { // if broadcaster data is present
                const broadcaster: [Broadcaster, string] =
                    parser.parseBroadcaster(message);
                that.broadcasters.setValue(broadcaster[1], broadcaster[0]);

            } else if (message.includes("PRIVMSG")) {
                const messageData: Message = parser.parseMessage(message);
                messageData.broadcaster = that.broadcasters.getValue(messageData.channel);
                const channelState: ChannelUserState = that.selves.getValue(messageData.channel);
                that.emit("message", messageData, channelState);
            } else if (message === "PING :tmi.twitch.tv") {
                that.chatServer.send("PONG :tmi.twitch.tv");
            } else if (message.includes("USERSTATE")) {
                if (message.includes("GLOBALUSERSTATE")) {
                    const userState: GlobalUserState = parser.parseGlobalUserState(message);
                    that.globalSelf = userState;
                    that.emit("global_user_state", userState);
                } else {
                    const userState: ChannelUserState = parser.parseChannelUserState(message);
                    that.selves.setValue(userState.channel, userState);
                    that.emit("channel_user_state", userState);
                }
            }
        };

        this.chatServer.onerror = function (err: Error): any {
            throw err;
        };
    }
    /**
     * Sends given message to the channel
     * @param message What content you want to send
     * @param channel Channel you want to send. Using # doesn't matter.
     */
    send(message: string, channel: string): void {
        this.chatServer.send(`PRIVMSG ${formatChannelName(channel)} :${message}`);
    }
}