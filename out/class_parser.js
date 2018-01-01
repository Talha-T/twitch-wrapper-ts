"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const util_1 = require("util");
const message_1 = require("./types/message");
/**
 * Parses Twitch response to TypeScript classes.
 */
class KeyValuePair {
    constructor(k, v) {
        this.key = k;
        this.value = v;
    }
}
class Parser {
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
    parseObject(message, t) {
        // a
        if (!message.startsWith("@")) {
            throw "Twitch messages should start with '@'";
        }
        // sample data
        // @broadcaster-lang=;emote-only=0;followers-only=-1;mercury=0;r9k=0;rituals=0;
        // room-id=134286305;slow=0;subs-only=0
        let trimmed = message.substr(1); // shift first letter (@)
        trimmed = trimmed.substring(0, trimmed.indexOf(":tmi") - 1); // do not include tmi.twitch.tv
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
    parseMessage(message) {
        // there are two :'s, first for seperating message data; second for content
        const colonIndex = message.indexOf(":");
        const data = message.substr(0, colonIndex); // get data 'til :
        const messageObj = this.parseObject(data, new message_1.Message());
        const channelIndex = message.indexOf("PRIVMSG") + "PRIVMSG".length + 1; // 1 for the space
        const lastColonIndex = message.indexOf(":");
        const channel = message.substring(channelIndex, lastColonIndex - 1);
        const content = message.substring(lastColonIndex + 1);
        messageObj.channel = channel;
        messageObj.content = content;
        return messageObj;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=class_parser.js.map