"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const util_1 = require("util");
const looseObject_1 = require("./looseObject");
/**
 * Parses Twitch response to TypeScript classes.
 */
class KeyValuePair {
    constructor(k, v) {
        this.key = k;
        this.value = v;
    }
}
exports.KeyValuePair = KeyValuePair;
class Parser {
    /**
     * converts key=value; pair into KeyValuePair instance.
     * @param str Parameter to get pair from
     */
    getPair(str) {
        const indexOfEquals = str.indexOf("=");
        const key = str.substr(0, indexOfEquals);
        const value = str.substr(indexOfEquals + 1);
        return new KeyValuePair(key, value);
    }
    /**
     * Parses Twitch message to type of T
     * @param message Twitch message to be parsed
     * @param propertyNameConversions If needed, convert twitch property names into class property names. e.g. subs-only to subscriberMode
     * @param t Empty instance of type T
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
        splitted.forEach(element => {
            const pair = this.getPair(element); // get pair
            let key = utils_1.convertCase(pair.key);
            if (util_1.isBoolean(t[key])) {
                pair.value = Boolean(pair.value);
            }
            else if (util_1.isNumber(t[key])) {
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
    parseMessage(message) {
        // there are two :'s, first for seperating message data; second for content
        const colonIndex = message.indexOf(":");
        const data = message.substr(0, colonIndex - 1); // get data 'til :
        const messageObj = this.parseObject(data, looseObject_1.Message);
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
        const broadcaster = this.parseObject(data, looseObject_1.Broadcaster);
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
        const userState = this.parseObject(data, looseObject_1.GlobalUserState);
        return userState;
    }
    parseChannelUserState(message) {
        const USERSTATE = ":tmi.twitch.tv USERSTATE";
        const userStateIndex = message.indexOf(USERSTATE);
        const data = message.substring(0, userStateIndex - 1);
        const userState = this.parseObject(data, looseObject_1.ChannelUserState);
        const channel = message.substring(userStateIndex + 1 + USERSTATE.length);
        userState.channel = channel.replace("\r\n", "");
        return userState;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map