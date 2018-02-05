import { stringify } from "query-string";

import { ITwitchErrorResponse } from "./apiTypes";
import { ILooseObject } from "./looseObject";
import TwitchError from "./twitchError";

interface IHeaders {
    [k: string]: string;
}

interface IMinimalResponse {
    status: number;
    json(): Promise<any>;
}

interface IMinimalFetch {
    get: (url: string, headers: IHeaders) => Promise<IMinimalResponse>;
    post: (url: string, headers: IHeaders) => Promise<IMinimalResponse>;
    put: (url: string, headers: IHeaders) => Promise<IMinimalResponse>;
    delete: (url: string, headers: IHeaders) => Promise<IMinimalResponse>;
}

const requestP: Promise<IMinimalFetch> = typeof fetch !== "undefined"
    ? Promise.resolve({
        delete: (url: string, headers: IHeaders) => fetch(url, { headers, method: "DELETE" }),
        get: (url: string, headers: IHeaders) => fetch(url, { headers, method: "GET" }),
        post: (url: string, headers: IHeaders) => fetch(url, { headers, method: "POST" }),
        put: (url: string, headers: IHeaders) => fetch(url, { headers, method: "PUT" }),
    }) : import("web-request" /* no module support for web-request */ + "").then((request) => {
        // normalize response
        Object.defineProperty(request.Response.prototype, "status", {
            get(this: { statusCode: number; }) { return this.statusCode; },
        });
        (request.Response.prototype as any).json = function(this: { content: string; }) {
            const text: string = this.content;
            return new Promise((s) => JSON.parse(text));
        };

        return {
            delete: (url: string, headers: IHeaders) => request.delete(url, { headers }),
            get: (url: string, headers: IHeaders) => request.get(url, { headers }),
            post: (url: string, headers: IHeaders) => request.post(url, { headers }),
            put: (url: string, headers: IHeaders) => request.put(url, { headers }),
        };
    });

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
     * Constructs ApiRequester instance
     * @param clientId Twitch Client ID for API Calls
     */
    public constructor(clientId: string) {
        this.clientId = clientId;
    }

    /**
     * Gets given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    public async get<T>(path: string, queryParameters: ILooseObject): Promise<T> {
        // url and headers for request
        const queryString: string = stringify(queryParameters);
        const uri: string = this.baseUrl + path + "?" + queryString;
        const headers: IHeaders = this.getHeaders();

        const request = await requestP;
        const result = await request.get(uri, headers);
        if (result.status > 308) { // 308 is the last 3xx status code.
            const errorObject: ITwitchErrorResponse = await result.json();
            throw new TwitchError(errorObject);
        }
        return result.json();
    }

    /**
     * Posts given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    public async post<T>(path: string, queryParameters: ILooseObject): Promise<T> {
        // url and headers for request
        const queryString: string = stringify(queryParameters);
        const uri: string = this.baseUrl + path + "?" + queryString;
        const headers: IHeaders = this.getHeaders();

        const request = await requestP;
        const result = await request.post(uri, headers);
        if (result.status > 308) { // 308 is the last 3xx status code.
            const errorObject: ITwitchErrorResponse = await result.json();
            throw new TwitchError(errorObject);
        }
        return result.json();
    }

    /**
     * Puts given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    public async put<T>(path: string, queryParameters: ILooseObject): Promise<T> {
        // url and headers for request
        const queryString: string = stringify(queryParameters);
        const uri: string = this.baseUrl + path + "?" + queryString;
        const headers: IHeaders = this.getHeaders();

        const request = await requestP;
        const result = await request.put(uri, headers);
        if (result.status > 308) { // 308 is the last 3xx status code.
            const errorObject: ITwitchErrorResponse = await result.json();
            throw new TwitchError(errorObject);
        }
        return result.json();
    }

    /**
     * Deletes given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    public async delete<T>(path: string, queryParameters: ILooseObject): Promise<T> {
        // url and headers for request
        const queryString: string = stringify(queryParameters);
        const uri: string = this.baseUrl + path + "?" + queryString;
        const headers: IHeaders = this.getHeaders();

        const request = await requestP;
        const result = await request.delete(uri, headers);
        if (result.status > 308) { // 308 is the last 3xx status code.
            const errorObject: ITwitchErrorResponse = await result.json();
            throw new TwitchError(errorObject);
        }
        return result.json();
    }

    /**
     * Adds oauth token to headers, you can chain this method
     * @param oauth Oauth key to pass with headers. Do NOT include 'Oauth ' prefix
     */
    public authorize(oauth: string): this {
        this.oauth = oauth;
        return this;
    }

    /**
     * Gets the headers
     */
    private getHeaders(): IHeaders {
        return {
            "Accept": "application/vnd.twitchtv.v5+json",
            "Authorization": "OAuth " + this.oauth,
            "Client-ID": this.clientId,
        };
    }
}
