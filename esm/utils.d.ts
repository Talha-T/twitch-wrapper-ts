/**
 * Replaces all occurrences of `seach` into `replacement`
 * @param self String to find "search" from
 * @param search String to search in "self"
 * @param replacement String to replace when "search" is found
 */
export declare function replaceAll(self: string, search: string, replacement: string): string;
/**
 * Replaces a letter with given index
 * @param text Text to replace
 * @param index Index to replace
 * @param replacement String to replace
 */
export declare function replaceAt(text: string, index: number, replacement: string): string;
/**
 * Converts this-case to thisCase
 * @param key Key to convert case
 */
export declare function convertCase(key: string): string;
export declare function formatChannelName(channel: string): string;
