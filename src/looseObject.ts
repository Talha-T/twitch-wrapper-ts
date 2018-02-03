// tslint:disable:max-classes-per-file

export interface ILooseObject {
    [key: string]: any;
}

export class Broadcaster implements ILooseObject {
    [key: string]: any;
    public broadcasterLang: string = "";
    public emoteOnly: boolean = false;
    public followersOnly: number = -1;
    public mercury: boolean = false;
    public r9k: boolean = false;
    public rituals: boolean = false;
    public roomId: number = -1;
    public slow: boolean = false;
    public subsOnly: boolean = false;
}

export class Message implements ILooseObject {
    // todo: implement badges and emotes
    [key: string]: any;
    public badges: string = "";
    public color: string = "";
    public displayName: string = "";
    public emotes: string = "";
    public id: string = "";
    public mod: boolean = false;
    public roomId: number = -1;
    public subscriber: boolean = false;
    public tmiSentTs: number = -1;
    public turbo: boolean = false;
    public userId: number = -1;
    public userType: string = "";
    public content: string = "";
    public channel: string = "";
    public broadcaster: Broadcaster;
}

export class UserState {
    public badges: string = "";
    public color: string = "";
    public displayName: string = "";
    public emoteSets: string = "";
    public userType: string = "";
}

export class GlobalUserState extends UserState {
    public userId: number = -1;
}

export class ChannelUserState extends UserState {
    public mod: boolean = false;
    public subscriber: boolean = false;
    public channel: string = "";
}
