"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Replaces all occurrences of `seach` into `replacement`
 * @param self String to find "search" from
 * @param search String to search in "self"
 * @param replacement String to replace when "search" is found
 */
function replaceAll(self, search, replacement) {
    return self.split(search).join(replacement);
}
exports.replaceAll = replaceAll;
/**
 * Replaces a letter with given index
 * @param text Text to replace
 * @param index Index to replace
 * @param replacement String to replace
 */
function replaceAt(text, index, replacement) {
    return text.substr(0, index) + replacement + text.substr(index + replacement.length);
}
exports.replaceAt = replaceAt;
/**
 * Converts this-case to thisCase
 * @param key Key to convert case
 */
function convertCase(key) {
    const index = key.indexOf("-");
    if (index === -1) {
        return key;
    }
    key = key.slice(0, index) + key.slice(index + 1, key.length);
    return convertCase(replaceAt(key, index, key.charAt(index).toLocaleUpperCase()));
}
exports.convertCase = convertCase;
function formatChannelName(channel) {
    return `#${channel.replace("#", "").toLowerCase()}`;
}
exports.formatChannelName = formatChannelName;
//# sourceMappingURL=utils.js.map