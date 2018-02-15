"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = require("query-string");
const twitchError_1 = require("./twitchError");
const requestP = typeof fetch !== "undefined"
    ? Promise.resolve({
        delete: (url, headers) => fetch(url, { headers, method: "DELETE" }),
        get: (url, headers) => fetch(url, { headers, method: "GET" }),
        post: (url, headers) => fetch(url, { headers, method: "POST" }),
        put: (url, headers) => fetch(url, { headers, method: "PUT" }),
    }) : Promise.resolve().then(() => require("web-request" /* no module support for web-request */ + "")).then((request) => {
    // normalize response
    Object.defineProperty(request.Response.prototype, "status", {
        get() { return this.statusCode; },
    });
    request.Response.prototype.json = function () {
        const text = this.content;
        return new Promise((resolve, reject) => resolve(JSON.parse(text)));
    };
    return {
        delete: (url, headers) => request.delete(url, { headers }),
        get: (url, headers) => request.get(url, { headers }),
        post: (url, headers) => request.post(url, { headers }),
        put: (url, headers) => request.put(url, { headers }),
    };
});
/**
 * The main Api Requester
 */
class ApiRequester {
    /**
     * Constructs ApiRequester instance
     * @param clientId Twitch Client ID for API Calls
     */
    constructor(clientId) {
        this.baseUrl = "https://api.twitch.tv/kraken/";
        this.clientId = "";
        this.oauth = "";
        this.clientId = clientId;
    }
    /**
     * Gets given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    get(path, queryParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // url and headers for request
            const queryString = query_string_1.stringify(queryParameters);
            const uri = this.baseUrl + path + "?" + queryString;
            const headers = this.getHeaders();
            const request = yield requestP;
            const result = yield request.get(uri, headers);
            if (result.status > 308) {
                const errorObject = yield result.json();
                throw new twitchError_1.default(errorObject);
            }
            return (yield result.json());
        });
    }
    /**
     * Posts given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    post(path, queryParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // url and headers for request
            const queryString = query_string_1.stringify(queryParameters);
            const uri = this.baseUrl + path + "?" + queryString;
            const headers = this.getHeaders();
            const request = yield requestP;
            const result = yield request.post(uri, headers);
            if (result.status > 308) {
                const errorObject = yield result.json();
                throw new twitchError_1.default(errorObject);
            }
            return result.json();
        });
    }
    /**
     * Puts given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    put(path, queryParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // url and headers for request
            const queryString = query_string_1.stringify(queryParameters);
            const uri = this.baseUrl + path + "?" + queryString;
            const headers = this.getHeaders();
            const request = yield requestP;
            const result = yield request.put(uri, headers);
            if (result.status > 308) {
                const errorObject = yield result.json();
                throw new twitchError_1.default(errorObject);
            }
            return result.json();
        });
    }
    /**
     * Deletes given **path** asynchronously
     * @param path Path for the api call. Do NOT Include https://api.twitch.tv/kraken/
     * @param queryParameters A key-value object that is stringified to query parameters with api call
     */
    delete(path, queryParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // url and headers for request
            const queryString = query_string_1.stringify(queryParameters);
            const uri = this.baseUrl + path + "?" + queryString;
            const headers = this.getHeaders();
            const request = yield requestP;
            const result = yield request.delete(uri, headers);
            if (result.status > 308) {
                const errorObject = yield result.json();
                throw new twitchError_1.default(errorObject);
            }
            return result.json();
        });
    }
    /**
     * Adds oauth token to headers, you can chain this method
     * @param oauth Oauth key to pass with headers. Do NOT include 'Oauth ' prefix
     */
    authorize(oauth) {
        this.oauth = oauth;
        return this;
    }
    /**
     * Generates the headers according to variables
     */
    getHeaders() {
        return {
            "Accept": "application/vnd.twitchtv.v5+json",
            "Authorization": "OAuth " + this.oauth,
            "Client-ID": this.clientId,
        };
    }
}
exports.ApiRequester = ApiRequester;
//# sourceMappingURL=requester.js.map