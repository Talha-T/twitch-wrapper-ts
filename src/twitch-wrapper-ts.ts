import { EventEmitter } from "events";

import { Broadcaster, ChannelUserState, GlobalUserState, Message, UserState } from "./looseObject";
import { Parser } from "./parser";
import { formatChannelName } from "./utils";

const parser: Parser = new Parser();

type IMinimalEventHandler<T, N extends string = string, B extends object = {}> =
    <E extends { type: N; target: T } & B>(event: E) => void;

interface IMinimalWebSocketBase {
    onopen: (e: any) => any;
    onclose: (e: any) => any;
    onmessage: (e: any) => any;
    onerror: (e: any) => any;

    send(data: any): void;
    close(code?: number, reason?: string): void;
}

/**
 * Data which could be received through a WebSocket.
 */
type WSData = string | ArrayBuffer | Blob | Uint8Array | Uint8Array[];

/**
 * Minimal definition of a WebSocket.
 */
interface IMinimalWebSocket extends IMinimalWebSocketBase {
    onopen: IMinimalEventHandler<this, "open">;
    onclose: IMinimalEventHandler<this, "close", { code?: number; reason?: string; }>;
    onmessage: IMinimalEventHandler<this, "message", { data: WSData; }>;
    onerror: IMinimalEventHandler<this, "error"> | ((e: any) => void);

    send(data: any): void;
    close(code?: number, reason?: string): void;
}

/**
 * Loosen event handler typings somewhat.
 * @param ws an instance of an class which implements the WebSocket spec
 */
function asMinimalWebSocket<T extends IMinimalWebSocketBase>(ws: T): IMinimalWebSocket { return ws as any; }

/**
 * Create a native WebSocket if available, otherwise load ws lib.
 */
const createWebSocket: (url: string) => Promise<IMinimalWebSocket> = typeof WebSocket !== "undefined"
    ? (url) => Promise.resolve(asMinimalWebSocket(new WebSocket(url)))
    : ((wsP) => (url: string) => wsP.then((ws) => asMinimalWebSocket(new ws(url))))(import("ws"));

/**
 * Throws TypeError when the value is `null` or `undefined`.
 * @param obj value to assert
 */
function notNull<T>(obj: T | null | undefined): T {
    if (obj === null || obj === undefined) {
        throw new TypeError("Unexpected null or undefined.");
    }
    return obj;
}

/**
 * The main class for accessing Twitch
 */
export class Twitch extends EventEmitter {

    private user: string;
    private oAuth: string;
    private channels: string[];
    private chatServer: Promise<IMinimalWebSocket>;

    /**
     * List of broadcasters. <channelString, Broadcaster>
     */
    private broadcasters: Map<string, Broadcaster> = new Map<string, Broadcaster>();
    private selves: Map<string, ChannelUserState> = new Map<string, ChannelUserState>();
    private globalSelf: GlobalUserState;

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
    public on(event: string | symbol, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }

    /**
     * Connects twitch client.
     */
    public async connect(): Promise<void> {
        const chatServer = await this.chatServer;
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
            const message: string = event.data.toString();
            if (message.includes("Login authentication failed")) {
                throw new Error("Login authentication failed");
            }
            if (message.includes("Welcome, GLHF!")) { // default connect message
                this.emit("connected");
            } else if (message.startsWith("@broadcaster")) { // if broadcaster data is present
                const broadcaster: [Broadcaster, string] =
                    parser.parseBroadcaster(message);
                this.broadcasters.set(broadcaster[1], broadcaster[0]);

            } else if (message.includes("PRIVMSG")) {
                const messageData: Message = parser.parseMessage(message);
                messageData.broadcaster = notNull(this.broadcasters.get(messageData.channel));
                const channelState: ChannelUserState = notNull(this.selves.get(messageData.channel));
                this.emit("message", messageData, channelState);
            } else if (message === "PING :tmi.twitch.tv") {
                chatServer.send("PONG :tmi.twitch.tv");
            } else if (message.includes("USERSTATE")) {
                if (message.includes("GLOBALUSERSTATE")) {
                    const userState: GlobalUserState = parser.parseGlobalUserState(message);
                    this.globalSelf = userState;
                    this.emit("global_user_state", userState);
                } else {
                    const userState: ChannelUserState = parser.parseChannelUserState(message);
                    this.selves.set(userState.channel, userState);
                    this.emit("channel_user_state", userState);
                }
            }
        };

        chatServer.onerror = (err: any) => {
            throw err;
        };
    }

    /**
     * Sends given message to the channel
     * @param message What content you want to send
     * @param channel Channel you want to send. Using # doesn't matter.
     */
    public async send(message: string, channel: string) {
        return (await this.chatServer).send(`PRIVMSG ${formatChannelName(channel)} :${message}`);
    }
}
