export interface ILooseObject {
    [key: string]: any;
}
export declare class Broadcaster implements ILooseObject {
    [key: string]: any;
    broadcasterLanguage: string;
    emoteOnly: boolean;
    followersOnly: number;
    mercury: boolean;
    r9k: boolean;
    rituals: boolean;
    roomId: number;
    slow: boolean;
    subsOnly: boolean;
}
export declare class Message implements ILooseObject {
    [key: string]: any;
    badges: string;
    color: string;
    displayName: string;
    emotes: string;
    id: string;
    mod: boolean;
    roomId: number;
    subscriber: boolean;
    tmiSentTs: number;
    turbo: boolean;
    userId: number;
    userType: string;
    content: string;
    channel: string;
}
