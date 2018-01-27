import * as request from "web-request";
import { stringify } from "query-string";
import TwitchError from "./twitchError";
import { TwitchErrorResponse } from "./apiTypes";
import { ILooseObject } from "./looseObject";

/**
 * Interface class for requesters
 */
export interface IRequester {
    get: <T>(url: string, queryParameters: ILooseObject) => Promise<T>;
    post: <T>(url: string, queryParameters: ILooseObject) => Promise<T>;
    put: <T>(url: string, queryParameters: ILooseObject) => Promise<T>;
    delete: <T>(url: string, queryParameters: ILooseObject) => Promise<T>;
}

/**
 * The main Api Requester
 */
export class ApiRequester implements IRequester {
    private baseUrl: string = "https://api.twitch.tv/kraken/";
    private clientId: string = "";
    private oauth: string = "";

    /**
     * Gets the headers
     */
    private getHeaders(): request.Headers {
        return {
            "Accept": "application/vnd.twitchtv.v5+json",
            "Client-ID": this.clientId,
            "Authorization": "OAuth " + this.oauth
        };
    }

    /**
     * Constructs ApiRequester instance
     * @param clientId Twitch Client ID for API Calls
     */
    constructor(clientId: string) {
        this.clientId = clientId;
    }

    /**
     * Gets given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    async get<T>(path: string, queryParameters: ILooseObject): Promise<T> {
        // url and headers for request
        const queryString: string = stringify(queryParameters);
        const uri: string = this.baseUrl + path + "?" + queryString;
        const headers: request.Headers = this.getHeaders();

        const result: request.Response<string> = await request.get(uri, {
            headers: headers
        });
        if (result.statusCode > 308) { // 308 is the last 3xx status code.
            const errorObject: TwitchErrorResponse = JSON.parse(result.content) as TwitchErrorResponse;
            throw new TwitchError(errorObject);
        }
        const resultObject: T = JSON.parse(result.content) as T;
        return resultObject;
    }

    /**
     * Posts given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    async post<T>(path: string, queryParameters: ILooseObject): Promise<T> {
        // url and headers for request
        const queryString: string = stringify(queryParameters);
        const uri: string = this.baseUrl + path + "?" + queryString;
        const headers: request.Headers = this.getHeaders();

        const result: request.Response<string> = await request.post(uri, {
            headers: headers
        });
        if (result.statusCode > 308) { // 308 is the last 3xx status code.
            const errorObject: TwitchErrorResponse = JSON.parse(result.content) as TwitchErrorResponse;
            throw new TwitchError(errorObject);
        }
        const resultObject: T = JSON.parse(result.content) as T;
        return resultObject;
    }

    /**
     * Puts given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    async put<T>(path: string, queryParameters: ILooseObject): Promise<T> {
        // url and headers for request
        const queryString: string = stringify(queryParameters);
        const uri: string = this.baseUrl + path + "?" + queryString;
        const headers: request.Headers = this.getHeaders();

        const result: request.Response<string> = await request.put(uri, {
            headers: headers
        });
        if (result.statusCode > 308) { // 308 is the last 3xx status code.
            const errorObject: TwitchErrorResponse = JSON.parse(result.content) as TwitchErrorResponse;
            throw new TwitchError(errorObject);
        }
        const resultObject: T = JSON.parse(result.content) as T;
        return resultObject;
    }

    /**
     * Deletes given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    async delete<T>(path: string, queryParameters: ILooseObject): Promise<T> {
        // url and headers for request
        const queryString: string = stringify(queryParameters);
        const uri: string = this.baseUrl + path + "?" + queryString;
        const headers: request.Headers = this.getHeaders();

        const result: request.Response<string> = await request.delete(uri, {
            headers: headers
        });
        if (result.statusCode > 308) { // 308 is the last 3xx status code.
            const errorObject: TwitchErrorResponse = JSON.parse(result.content) as TwitchErrorResponse;
            throw new TwitchError(errorObject);
        }
        const resultObject: T = JSON.parse(result.content) as T;
        return resultObject;
    }

    /**
     * Adds oauth token to headers, you can chain this method
     * @param oauth Oauth key to pass with headers. Do NOT include 'Oauth ' prefix
     */
    authorize(oauth: string): this {
        this.oauth = oauth;
        return this;
    }
}