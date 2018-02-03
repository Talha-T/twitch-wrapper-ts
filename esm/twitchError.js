export default class TwitchError extends Error {
    constructor(twitchErrorResponse) {
        super(twitchErrorResponse.message);
        this.message = twitchErrorResponse.message;
        this.response = twitchErrorResponse;
    }
}
//# sourceMappingURL=twitchError.js.map