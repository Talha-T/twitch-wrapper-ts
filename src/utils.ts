import camelcase = require("camelcase");

/**
 * Replaces all occurrences of `seach` into `replacement`
 * @param self String to find "search" from
 * @param search String to search in "self"
 * @param replacement String to replace when "search" is found
 */
export function replaceAll(self: string, search: string, replacement: string): string {
    return self.split(search).join(replacement);
}

/**
 * Replaces a letter with given index
 * @param text Text to replace
 * @param index Index to replace
 * @param replacement String to replace
 */
export function replaceAt(text: string, index: number, replacement: string): string {
    return text.substr(0, index) + replacement + text.substr(index + replacement.length);
}

/**
 * Converts _this-case to thisCase
 * @param key Key to convert case
 */
export function convertCase(key: string): string {
    return camelcase(key);
}

/**
 * Converts CHANNEL to #channel or #CHANNEL to #channel
 * @param channel The channel name to format properly
 */
export function formatChannelName(channel: string): string {
    return `#${channel.replace("#", "").toLowerCase()}`;
}

/**
 * Converts all property cases to camel cases.
 * @param obj Object to convert the keys from
 */
export function toProperObject(obj: any) {
    if (!obj) {
        return obj;
    }
    Object.keys(obj).forEach((key) => {
        let val = obj[key];
        if (typeof (val) === "object") {
            val = toProperObject(val);
        }
        delete obj[key];
        obj[camelcase(key)] = val;
    });
    return obj;
}
