import * as ws from "ws";
import { Data } from "ws";
import { Parser } from "./parser";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { EventEmitter } from "events";
import { Broadcaster, Message } from "./looseObject";
const parser: Parser = new Parser;

/**
 * The main class for accessing Twitch
 */
export class Twitch extends EventEmitter {
    /**
     * Constructs Twitch class. This needs a username and oauth password.
     * If you don't have an oauth password, get it here: https://twitchapps.com/tmi/
     * @param userName Username for the bot.
     * @param password Oauth password for the bot.
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
     * @param event The event to listen to
     * @param listener The handler of the event
     */
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }
    broadcasters: Dictionary<string, Broadcaster> = new Dictionary<string, Broadcaster>();
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
                that.chatServer.send(`JOIN #${channel.replace("#", "").toLowerCase()}`)
            ); // if channel has #, remove it ; also, lowercase the channel otherwise twitch doesn't work.
            that.chatServer.send(`USER ${that.user}`);
            // chatServer.send("PRIVMSG #implicit1 :This is a sample message");
        };

        this.chatServer.onmessage = function (event: { data: ws.Data, type: string, target: ws }): any {
            const message: string = event.data.toString();
            if (message.includes("Login authentication failed")) {
                throw new Error("Login authentication failed");
            }
            if (message.includes("Welcome, GLHF!")) { // default connect message
                that.emit("connected");
            } else if (message.startsWith("@broadcaster")) { // if broadcaster data is present
                const broadcaster: { broadcaster: Broadcaster, channel: string } =
                    parser.parseBroadcaster(message) as { broadcaster: Broadcaster, channel: string };
                that.broadcasters.setValue(broadcaster.channel, broadcaster.broadcaster);

            } else if (message.includes("PRIVMSG")) {
                const messageData: Message = parser.parseMessage(message);
                messageData.broadcaster = that.broadcasters.getValue(messageData.channel);
                that.emit("message", messageData);
            } else if (message === "PING :tmi.twitch.tv") {
                that.chatServer.send("PONG :tmi.twitch.tv");
            }
        };

        this.chatServer.onerror = function (err: Error): any {
            throw err;
        };
    }
}