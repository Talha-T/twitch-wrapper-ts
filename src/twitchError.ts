import { ITwitchErrorResponse } from "./apiTypes";

export default class TwitchError extends Error {
    public response: ITwitchErrorResponse;
    public constructor(twitchErrorResponse: ITwitchErrorResponse) {
        super(twitchErrorResponse.message);
        this.message = twitchErrorResponse.message;
        this.response = twitchErrorResponse;
    }
}
