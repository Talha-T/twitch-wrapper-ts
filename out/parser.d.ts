import { Message } from "./types/message";
/**
 * Parses Twitch response to TypeScript classes.
 */
export declare class KeyValuePair {
    constructor(k: string, v: string);
    key: string;
    value: any;
}
export declare class Parser {
    /**
     * converts key=value; pair into KeyValuePair instance.
     * @param str Parameter to get pair from
     */
    getPair(str: string): KeyValuePair;
    /**
     * Parses Twitch message to type of T
     * @param message Twitch message to be parsed
     * @param propertyNameConversions If needed, convert twitch property names into class property names. e.g. subs-only to subscriberMode
     * @param t Empty instance of type T
     */
    parseObject(message: string, t: ILooseObject): ILooseObject;
    /**
     * Parses message class from tmi message
     * @param message Message to parse
     */
    parseMessage(message: string): Message;
}
