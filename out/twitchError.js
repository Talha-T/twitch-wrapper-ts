"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TwitchError extends Error {
    constructor(twitchErrorResponse) {
        super(twitchErrorResponse.message);
        this.message = twitchErrorResponse.message;
        this.response = twitchErrorResponse;
    }
}
exports.default = TwitchError;
//# sourceMappingURL=twitchError.js.map