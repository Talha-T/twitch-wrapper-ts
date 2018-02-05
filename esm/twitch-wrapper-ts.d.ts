/// <reference types="node" />
import { EventEmitter } from "events";
/**
 * The main class for accessing Twitch
 */
export declare class Twitch extends EventEmitter {
    private user;
    private oAuth;
    private channels;
    private chatServer;
    /**
     * List of broadcasters. <channelString, Broadcaster>
     */
    private broadcasters;
    private selves;
    private globalSelf;
    /**
     * Constructs Twitch class. This needs a username and oauth password.
     * If you don't have an oauth password, get it here: https://twitchapps.com/tmi/
     * @param userName Username for the bot.
     * @param password Oauth password for the bot. Do NOT include the prefix `oauth:`
     * @param channels Channels for bot to work on.
     */
    constructor(userName: string, password: string, ...channels: string[]);
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
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    /**
     * Connects twitch client.
     */
    connect(): Promise<void>;
    /**
     * Sends given message to the channel
     * @param message What content you want to send
     * @param channel Channel you want to send. Using # doesn't matter.
     */
    send(message: string, channel: string): Promise<void>;
}
