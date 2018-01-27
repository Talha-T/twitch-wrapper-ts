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
const request = require("web-request");
const query_string_1 = require("query-string");
const twitchError_1 = require("./twitchError");
class ApiRequester {
    constructor(clientId) {
        this.baseUrl = "https://api.twitch.tv/kraken/";
        this.clientId = "";
        this.clientId = clientId;
    }
    getHeaders() {
        return {
            "Accept": "application/vnd.twitchtv.v5+json",
            "Client-ID": this.clientId
        };
    }
    get(path, queryParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // url and headers for request
            const queryString = query_string_1.stringify(queryParameters);
            const uri = this.baseUrl + path + "?" + queryString;
            const headers = this.getHeaders();
            const result = yield request.get(uri, {
                headers: headers
            });
            if (result.statusCode > 308) {
                const errorObject = JSON.parse(result.content);
                throw new twitchError_1.default(errorObject);
            }
            const resultObject = JSON.parse(result.content);
            return resultObject;
        });
    }
    post(path, queryParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // url and headers for request
            const queryString = query_string_1.stringify(queryParameters);
            const uri = this.baseUrl + path + "?" + queryString;
            const headers = this.getHeaders();
            const result = yield request.post(uri, {
                headers: headers
            });
            if (result.statusCode > 308) {
                const errorObject = JSON.parse(result.content);
                throw new twitchError_1.default(errorObject);
            }
            const resultObject = JSON.parse(result.content);
            return resultObject;
        });
    }
}
exports.ApiRequester = ApiRequester;
//# sourceMappingURL=requester.js.map