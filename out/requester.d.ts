import { ILooseObject } from "./looseObject";
export interface IRequester {
    get: <T>(url: string, queryParameters: string[]) => Promise<T>;
    post: <T>(url: string, queryParameters: string[]) => Promise<T>;
    put: <T>(url: string, queryParameters: string[]) => Promise<T>;
    delete: <T>(url: string, queryParameters: string[]) => Promise<T>;
}
export declare class ApiRequester implements IRequester {
    private baseUrl;
    private clientId;
    private getHeaders();
    constructor(clientId: string);
    get<T>(path: string, queryParameters: ILooseObject): Promise<T>;
    post<T>(path: string, queryParameters: ILooseObject): Promise<T>;
    put: <T>(url: string, queryParameters: string[]) => Promise<T>;
    delete: <T>(url: string, queryParameters: string[]) => Promise<T>;
}
