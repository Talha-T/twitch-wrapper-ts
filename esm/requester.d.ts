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
export declare class ApiRequester implements IRequester {
    private baseUrl;
    private clientId;
    private oauth;
    /**
     * Constructs ApiRequester instance
     * @param clientId Twitch Client ID for API Calls
     */
    constructor(clientId: string);
    /**
     * Gets given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    get<T>(path: string, queryParameters: ILooseObject): Promise<T>;
    /**
     * Posts given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    post<T>(path: string, queryParameters: ILooseObject): Promise<T>;
    /**
     * Puts given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    put<T>(path: string, queryParameters: ILooseObject): Promise<T>;
    /**
     * Deletes given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    delete<T>(path: string, queryParameters: ILooseObject): Promise<T>;
    /**
     * Adds oauth token to headers, you can chain this method
     * @param oauth Oauth key to pass with headers. Do NOT include 'Oauth ' prefix
     */
    authorize(oauth: string): this;
    /**
     * Gets the headers
     */
    private getHeaders();
}
