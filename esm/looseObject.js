// tslint:disable:max-classes-per-file
export class Broadcaster {
    constructor() {
        this.broadcasterLang = "";
        this.emoteOnly = false;
        this.followersOnly = -1;
        this.mercury = false;
        this.r9k = false;
        this.rituals = false;
        this.roomId = -1;
        this.slow = false;
        this.subsOnly = false;
    }
}
export class Message {
    constructor() {
        this.badges = "";
        this.color = "";
        this.displayName = "";
        this.emotes = "";
        this.id = "";
        this.mod = false;
        this.roomId = -1;
        this.subscriber = false;
        this.tmiSentTs = -1;
        this.turbo = false;
        this.userId = -1;
        this.userType = "";
        this.content = "";
        this.channel = "";
    }
}
export class UserState {
    constructor() {
        this.badges = "";
        this.color = "";
        this.displayName = "";
        this.emoteSets = "";
        this.userType = "";
    }
}
export class GlobalUserState extends UserState {
    constructor() {
        super(...arguments);
        this.userId = -1;
    }
}
export class ChannelUserState extends UserState {
    constructor() {
        super(...arguments);
        this.mod = false;
        this.subscriber = false;
        this.channel = "";
    }
}
//# sourceMappingURL=looseObject.js.map