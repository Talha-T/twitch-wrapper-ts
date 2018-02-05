import { Broadcaster, ChannelUserState, GlobalUserState, ILooseObject, Message } from "./looseObject";
/**
 * Parses Twitch response to TypeScript classes.
 */
export declare class Parser {
    /**
     * converts key=value; pair into KeyValuePair instance.
     * @param str Parameter to get pair from
     */
    getPair(str: string): [string, string];
    /**
     * Parses Twitch message to type of T
     * @param message Twitch message to be parsed
     * @param type Constructor of T
     */
    parseObject<T extends ILooseObject>(message: string, type: {
        new (): T;
    }): T;
    /**
     * Parses message class from tmi message
     * @param message Message to parse
     */
    parseMessage(message: string): Message;
    /**
     * Parses broadcaster and channel of Twitch data.
     * @param message Message to parse
     */
    parseBroadcaster(message: string): [Broadcaster, string];
    /**
     * Parses user state from string
     * @param message Message to parse user state from
     */
    parseGlobalUserState(message: string): GlobalUserState;
    parseChannelUserState(message: string): ChannelUserState;
}
