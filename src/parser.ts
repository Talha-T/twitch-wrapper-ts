import { Dictionary } from "typescript-collections";
import { convertCase } from "./utils";
import { isNumber, isBoolean } from "util";
import { Message, ILooseObject, Broadcaster, UserState, GlobalUserState, ChannelUserState } from "./looseObject";

/**
 * Parses Twitch response to TypeScript classes.
 */

export class KeyValuePair {
    constructor(k: string, v: string) {
        this.key = k;
        this.value = v;
    }
    key: string;
    value: any;
}

export class Parser {
    /**
     * converts key=value; pair into KeyValuePair instance.
     * @param str Parameter to get pair from
     */
    getPair(str: string): KeyValuePair {
        const indexOfEquals: number = str.indexOf("=");
        const key: string = str.substr(0, indexOfEquals);
        const value: string = str.substr(indexOfEquals + 1);
        return new KeyValuePair(key, value);
    }
    /**
     * Parses Twitch message to type of T
     * @param message Twitch message to be parsed
     * @param propertyNameConversions If needed, convert twitch property names into class property names. e.g. subs-only to subscriberMode
     * @param t Empty instance of type T
     */
    parseObject<T extends ILooseObject>(message: string, type: { new(): T; }): T {
        const t: T = new type();
        let trimmed: string = message;
        if (trimmed.startsWith("@")) {
            trimmed = trimmed.substring(1); // shift @
        }
        // sample data
        // @broadcaster-lang=;emote-only=0;followers-only=-1;mercury=0;r9k=0;rituals=0;
        // room-id=134286305;slow=0;subs-only=0
        if (trimmed.indexOf(":tmi") > -1) {
            trimmed = trimmed.substring(0, trimmed.indexOf(":tmi") - 1); // do not include tmi.twitch.tv
        }
        const splitted: string[] = trimmed.split(";"); // split at ';'
        splitted.forEach(element => {
            const pair: KeyValuePair = this.getPair(element); // get pair
            let key: string = convertCase(pair.key);
            if (isBoolean(t[key])) {
                pair.value = Boolean(pair.value);
            } else if (isNumber(t[key])) {
                pair.value = parseInt(pair.value, 10);
            }
            t[key] = pair.value; // set key on object
        });

        return t;
    }
    /**
     * Parses message class from tmi message
     * @param message Message to parse
     */
    parseMessage(message: string): Message {
        // there are two :'s, first for seperating message data; second for content
        const colonIndex: number = message.indexOf(":");
        const data: string = message.substr(0, colonIndex - 1); // get data 'til :
        const messageObj: Message = this.parseObject(data, Message);

        const channelIndex: number = message.indexOf("PRIVMSG") + "PRIVMSG".length + 1; // 1 for the space
        const lastColonIndex: number = message.lastIndexOf(":");
        const channel: string = message.substring(channelIndex, lastColonIndex - 1);
        const content: string = message.substring(lastColonIndex + 1);
        messageObj.channel = channel;
        messageObj.content = content.replace("\r\n", ""); // remove default empty line
        return messageObj;
    }

    /**
     * Parses broadcaster and channel of Twitch data.
     * @param message Message to parse
     */
    parseBroadcaster(message: string): [Broadcaster, string] {
        // @broadcaster-lang=;emote-only=0;followers-only=-1;mercury=0;r9k=0;rituals=0;room-id=155856431;
        // slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #ligbot
        const ROOMSTATE: string = ":tmi.twitch.tv ROOMSTATE";
        const roomStateIndex: number = message.indexOf(ROOMSTATE);
        const data: string = message.substring(0, roomStateIndex - 1); // broadcaster data
        const broadcaster: Broadcaster = this.parseObject(data, Broadcaster);
        const channel: string = message.substring(roomStateIndex + 1 + ROOMSTATE.length).replace("\r\n", "");
        return [broadcaster, channel];
    }

    /**
     * Parses user state from string
     * @param message Message to parse user state from
     */
    parseGlobalUserState(message: string): GlobalUserState {
        const USERSTATE: string = ":tmi.twitch.tv GLOBALUSERSTATE";
        const userStateIndex: number = message.indexOf(USERSTATE);
        const data: string = message.substring(0, userStateIndex - 1);
        const userState: GlobalUserState = this.parseObject(data, GlobalUserState);
        return userState;
    }

    parseChannelUserState(message: string): ChannelUserState {
        const USERSTATE: string = ":tmi.twitch.tv USERSTATE";
        const userStateIndex: number = message.indexOf(USERSTATE);
        const data: string = message.substring(0, userStateIndex - 1);
        const userState: ChannelUserState = this.parseObject(data, ChannelUserState);
        const channel: string = message.substring(userStateIndex + 1 + USERSTATE.length);
        userState.channel = channel.replace("\r\n", "");
        return userState;
    }

}