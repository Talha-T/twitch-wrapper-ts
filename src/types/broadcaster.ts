export class Broadcaster implements ILooseObject {
    [key: string]: any;
    broadcasterLanguage: string = "";
    emoteOnly: boolean = false;
    followersOnly: number = -1;
    mercury: boolean = false;
    r9k: boolean = false;
    rituals: boolean = false;
    roomId: number = -1;
    slow: boolean = false;
    subsOnly: boolean = false;
}

