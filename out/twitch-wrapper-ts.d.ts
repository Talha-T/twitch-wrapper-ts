/// <reference types="node" />
/// <reference types="ws" />
import * as ws from "ws";
import { EventEmitter } from "events";
/**
 * The main class for accessing Twitch
 */
export declare class Twitch extends EventEmitter {
    /**
     * Constructs Twitch class. This needs a username and oauth password.
     * If you don't have an oauth password, get it here: https://twitchapps.com/tmi/
     * @param userName Username for the bot.
     * @param password Oauth password for the bot.
     * @param channels Channels for bot to work on.
     */
    constructor(userName: string, password: string, ...channels: string[]);
    user: string;
    oAuth: string;
    channels: string[];
    chatServer: ws;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    /**
     * Connects twitch client.
     */
    connect(): void;
}
