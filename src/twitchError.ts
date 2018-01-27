import { TwitchErrorResponse } from "./apiTypes";

export default class TwitchError extends Error {
    response: TwitchErrorResponse;
    constructor(twitchErrorResponse: TwitchErrorResponse) {
        super(twitchErrorResponse.message);
        this.message = twitchErrorResponse.message;
        this.response = twitchErrorResponse;
    }
}