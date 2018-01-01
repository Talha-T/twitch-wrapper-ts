"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function replaceAll(self, search, replacement) {
    return self.split(search).join(replacement);
}
exports.replaceAll = replaceAll;
function replaceAt(text, index, replacement) {
    return text.substr(0, index) + replacement + text.substr(index + replacement.length);
}
exports.replaceAt = replaceAt;
function convertCase(key) {
    const index = key.indexOf("-");
    if (index === -1) {
        return key;
    }
    key = key.slice(0, index) + key.slice(index + 1, key.length);
    return convertCase(replaceAt(key, index, key.charAt(index).toLocaleUpperCase()));
}
exports.convertCase = convertCase;
function isNumeric(n) {
    return n !== "" && !isNaN(Number(n));
}
exports.isNumeric = isNumeric;
//# sourceMappingURL=utils.js.map