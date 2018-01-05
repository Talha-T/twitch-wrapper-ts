export interface ILooseObject {
    [key: string]: any;
}
export declare class Broadcaster implements ILooseObject {
    [key: string]: any;
    broadcasterLang: string;
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
    broadcaster: Broadcaster;
}
export declare class UserState {
    badges: string;
    color: string;
    displayName: string;
    emoteSets: string;
    userType: string;
}
export declare class GlobalUserState extends UserState {
    userId: number;
}
export declare class ChannelUserState extends UserState {
    mod: boolean;
    subscriber: boolean;
    channel: string;
}
