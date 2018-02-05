/**
 * Replaces all occurrences of `seach` into `replacement`
 * @param self String to find "search" from
 * @param search String to search in "self"
 * @param replacement String to replace when "search" is found
 */
export function replaceAll(self, search, replacement) {
    return self.split(search).join(replacement);
}
/**
 * Replaces a letter with given index
 * @param text Text to replace
 * @param index Index to replace
 * @param replacement String to replace
 */
export function replaceAt(text, index, replacement) {
    return text.substr(0, index) + replacement + text.substr(index + replacement.length);
}
/**
 * Converts this-case to thisCase
 * @param key Key to convert case
 */
export function convertCase(key) {
    const index = key.indexOf("-");
    if (index === -1) {
        return key;
    }
    key = key.slice(0, index) + key.slice(index + 1, key.length);
    return convertCase(replaceAt(key, index, key.charAt(index).toLocaleUpperCase()));
}
export function formatChannelName(channel) {
    return `#${channel.replace("#", "").toLowerCase()}`;
}
//# sourceMappingURL=utils.js.map