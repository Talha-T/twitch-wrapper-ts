import { TwitchErrorResponse } from "./apiTypes";
export default class TwitchError extends Error {
    response: TwitchErrorResponse;
    constructor(twitchErrorResponse: TwitchErrorResponse);
}
