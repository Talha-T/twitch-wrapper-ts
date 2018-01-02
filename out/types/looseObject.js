"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Broadcaster {
    constructor() {
        this.broadcasterLanguage = "";
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
exports.Broadcaster = Broadcaster;
class Message {
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
exports.Message = Message;
//# sourceMappingURL=looseObject.js.map