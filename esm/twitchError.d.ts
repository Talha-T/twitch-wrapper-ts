import { ITwitchErrorResponse } from "./apiTypes";
export default class TwitchError extends Error {
    response: ITwitchErrorResponse;
    constructor(twitchErrorResponse: ITwitchErrorResponse);
}
