import { Broadcaster, ChannelUserState, GlobalUserState, Message } from "./looseObject";
import { convertCase } from "./utils";
/**
 * Parses Twitch response to TypeScript classes.
 */
export class Parser {
    /**
     * converts key=value; pair into KeyValuePair instance.
     * @param str Parameter to get pair from
     */
    getPair(str) {
        const indexOfEquals = str.indexOf("=");
        const key = str.substr(0, indexOfEquals);
        const value = str.substr(indexOfEquals + 1);
        return [key, value];
    }
    /**
     * Parses Twitch message to type of T
     * @param message Twitch message to be parsed
     * @param type Constructor of T
     */
    parseObject(message, type) {
        const t = new type();
        let trimmed = message;
        if (trimmed.startsWith("@")) {
            trimmed = trimmed.substring(1); // shift @
        }
        // sample data
        // @broadcaster-lang=;emote-only=0;followers-only=-1;mercury=0;r9k=0;rituals=0;
        // room-id=134286305;slow=0;subs-only=0
        if (trimmed.indexOf(":tmi") > -1) {
            trimmed = trimmed.substring(0, trimmed.indexOf(":tmi") - 1); // do not include tmi.twitch.tv
        }
        const splitted = trimmed.split(";"); // split at ';'
        splitted.forEach((element) => {
            const pair = this.getPair(element); // get pair
            const key = convertCase(pair[0]);
            if (typeof t[key] === "boolean") {
                t[key] = Boolean(pair[1]);
            }
            else if (typeof t[key] === "number") {
                t[key] = parseInt(pair[1], 10);
            }
            else {
                t[key] = pair[1];
            }
        });
        return t;
    }
    /**
     * Parses message class from tmi message
     * @param message Message to parse
     */
    parseMessage(message) {
        // there are two :'s, first for seperating message data; second for content
        const colonIndex = message.indexOf(":");
        const data = message.substr(0, colonIndex - 1); // get data 'til :
        const messageObj = this.parseObject(data, Message);
        const channelIndex = message.indexOf("PRIVMSG") + "PRIVMSG".length + 1; // 1 for the space
        const lastColonIndex = message.lastIndexOf(":");
        const channel = message.substring(channelIndex, lastColonIndex - 1);
        const content = message.substring(lastColonIndex + 1);
        messageObj.channel = channel;
        messageObj.content = content.replace("\r\n", ""); // remove default empty line
        return messageObj;
    }
    /**
     * Parses broadcaster and channel of Twitch data.
     * @param message Message to parse
     */
    parseBroadcaster(message) {
        // @broadcaster-lang=;emote-only=0;followers-only=-1;mercury=0;r9k=0;rituals=0;room-id=155856431;
        // slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #ligbot
        const ROOMSTATE = ":tmi.twitch.tv ROOMSTATE";
        const roomStateIndex = message.indexOf(ROOMSTATE);
        const data = message.substring(0, roomStateIndex - 1); // broadcaster data
        const broadcaster = this.parseObject(data, Broadcaster);
        const channel = message.substring(roomStateIndex + 1 + ROOMSTATE.length).replace("\r\n", "");
        return [broadcaster, channel];
    }
    /**
     * Parses user state from string
     * @param message Message to parse user state from
     */
    parseGlobalUserState(message) {
        const USERSTATE = ":tmi.twitch.tv GLOBALUSERSTATE";
        const userStateIndex = message.indexOf(USERSTATE);
        const data = message.substring(0, userStateIndex - 1);
        const userState = this.parseObject(data, GlobalUserState);
        return userState;
    }
    parseChannelUserState(message) {
        const USERSTATE = ":tmi.twitch.tv USERSTATE";
        const userStateIndex = message.indexOf(USERSTATE);
        const data = message.substring(0, userStateIndex - 1);
        const userState = this.parseObject(data, ChannelUserState);
        const channel = message.substring(userStateIndex + 1 + USERSTATE.length);
        userState.channel = channel.replace("\r\n", "");
        return userState;
    }
}
//# sourceMappingURL=parser.js.map