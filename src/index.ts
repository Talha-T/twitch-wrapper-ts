import * as ws from "ws";
import { Data } from "ws";
import { Parser } from "./parser";
import { Broadcaster } from "./types/broadcaster";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { EventEmitter } from "events";
const parser: Parser = new Parser;

/**
 * The main class for accessing Twitch
 */
export default class Twitch extends EventEmitter {
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
            if (message.startsWith(":tmi.twitch.tv NOTICE * :Login authentication failed")) {
                throw new Error("Login authentication failed");
            }
            if (message.startsWith(":tmi.twitch.tv 001 implicit1 :Welcome, GLHF!")) { // default connect message
                that.emit("connected");
            } else if (message.startsWith("@broadcaster")) { // if broadcaster data is present
                const broadcaster: Broadcaster = parser.parseObject(message, new Broadcaster()) as Broadcaster;
                // console.log(broadcaster);
            } else if (message.includes("PRIVMSG")) {
                that.emit("message", parser.parseMessage(message));
            } else if (message === "PING :tmi.twitch.tv") {
                that.chatServer.send("PONG :tmi.twitch.tv");
            }
        };

        this.chatServer.onerror = function (err: Error): any {
            throw err;
        };
    }
}

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