import { ApiRequester } from "..";
import {
    Game, GameResponse, IClip, IClipQueryParameters,
    IGameQueryParameters, IStreamQueryParameters, ITopGamesQueryParameters, ITwitchSuccessResponse,
    IUpdateDescriptionQueryParameters, IUserFollowsQueryParameters, IUserQueryParameters, IVideosQueryParameters,
    Stream, StreamResponse, TwitchSuccessResponse, User, UserFollowResult, UserResult, VideoResponse,
} from "../apiTypes";
import { toProperObject } from "../utils";

export interface IEndpoint<T, Q> {
    path: string;
    /**
     * Sets the Bearer token to pass along with the calls.
     */
    authorize: (pass: string) => this;
    /**
     * Sets the client ID for later possibilities.
     */
    setClientId: (pass: string) => this;
    /**
     * Gets the data from API, asynchronously.
     */
    get: (queryArguments: Q) => Promise<T>;
    /**
     * Puts the data from API, asynchronously.
     */
    put: (queryArguments: Q) => Promise<T>;
    /**
     * Posts the data from API, asynchronously.
     */
    post: (queryArguments: Q) => Promise<T>;
    /**
     * Deletes the data from API, asynchronously.
     */
    delete: (queryArguments: Q) => Promise<T>;
}

export class Endpoint<T, Q extends object> implements IEndpoint<T, Q> {
    public path: string;
    protected requester: ApiRequester<Q>;

    public constructor(clientId: string, oauth: string, path: string) {
        this.requester = new ApiRequester(clientId, oauth);
        this.path = path;
    }

    public async get(queryArguments: Q = {} as Q): Promise<T> {
        const result = await (this.requester.get<T>(this.path, queryArguments));
        return toProperObject(result);
    }

    public async put(queryArguments: Q = {} as Q): Promise<T> {
        return await (this.requester.put<T>(this.path, queryArguments));
    }

    public async post(queryArguments: Q = {} as Q): Promise<T> {
        return await (this.requester.post<T>(this.path, queryArguments));
    }

    public async delete(queryArguments: Q = {} as Q): Promise<T> {
        return await (this.requester.delete<T>(this.path, queryArguments));
    }

    public authorize(password: string): this {
        this.requester.authorize(password);
        return this;
    }

    public setClientId(clientId: string): this {
        this.requester.setClientId(clientId);
        return this;
    }

}

/**
 * Gets information about one or more specified Twitch users. Users are identified by optional
 * user IDs and/or login name. If neither a user ID nor a login name is specified, the user is
 * looked up by Bearer token.
 * Use put request with description parameter to update user description.
 */
export interface IUserEndpoint extends IEndpoint<UserResult, IUserQueryParameters> {
    /**
     * Gets information on follow relationships between two Twitch users. Information returned is
     * sorted in order, most recent follow first. This can return information like
     * "who is lirik following," "who is following lirik,” or “is user X following user Y.”
     */
    follows: IEndpoint<UserFollowResult, IUserFollowsQueryParameters>;
}

class UserEndpoint extends Endpoint<UserResult, IUserQueryParameters> {
    public follows: IEndpoint<UserFollowResult, IUserFollowsQueryParameters>;
    constructor(clientId: string, oauth: string) {
        super(clientId, oauth, "/users");
        this.follows = new Endpoint(clientId, oauth, "/users/follows");
    }
}

/**
 * Gets game information by game ID or name.
 */
export interface IGameEndpoint extends IEndpoint<GameResponse, IGameQueryParameters> {
    top: IEndpoint<GameResponse, ITopGamesQueryParameters>;
}

class GameEndpoint extends Endpoint<GameResponse, IGameQueryParameters> implements IGameEndpoint {
    public top: IEndpoint<GameResponse, ITopGamesQueryParameters>;
    constructor(clientId: string, oauth: string) {
        super(clientId, oauth, "/games");
        this.top = new Endpoint(clientId, oauth, "/games/top");
    }
}

export interface ITwitchApi {
    clips: IEndpoint<ITwitchSuccessResponse<IClip[]>, IClipQueryParameters>;
    games: IEndpoint<GameResponse, IGameQueryParameters>;
    users: IUserEndpoint;
    streams: IEndpoint<StreamResponse, IStreamQueryParameters>;
    videos: IEndpoint<VideoResponse, IVideosQueryParameters>;
}

/**
 * Main class for making Twitch API calls.
 */
export class TwitchApi implements ITwitchApi {

    /**
     * Gets information about one or more specified Twitch users. Users are identified by optional
     * user IDs and/or login name. If neither a user ID nor a login name is specified, the user is
     * looked up by Bearer token.
     * If you wanna update user description via put, pass an IUpdateDescriptionQueryParameters instead.
     */
    public users: IUserEndpoint;

    /**
     * Gets game information by game ID or name.
     */
    public games: IGameEndpoint;

    /**
     * Gets information about active streams. Streams are returned sorted
     *  by number of current viewers, in descending order. Across multiple pages of results,
     * there may be duplicate or missing streams, as viewers join and leave streams.
     */
    public streams: IEndpoint<StreamResponse, IStreamQueryParameters>;

    /**
     * Gets video information by video ID (one or more), user ID (one only), or game ID (one only).
     */
    public videos: IEndpoint<VideoResponse, IVideosQueryParameters>;

    /**
     * Gets information about a specified clip OR Creates a clip programmatically. This returns both an ID and
     *  an edit URL for the new clip.
     * Use get for getting the clip and post for creating one.
     *
     * **Do not Use IClip and IClipQueryParameters, but (cast to) Clip, CreatedClipt; ICreatedClipParameters and
     * IGetClipParameters instead.**
     */
    public clips: IEndpoint<ITwitchSuccessResponse<IClip[]>, IClipQueryParameters>;

    /**
     * Constructs the API caller with a client ID.
     * @param clientId The client ID to make calls with.
     * @param oauth Optional Bearer token to pass with the API call.
     */
    public constructor(clientId: string, oauth: string = "") {
        this.users = new UserEndpoint(clientId, oauth);
        this.games = new GameEndpoint(clientId, oauth);
        this.streams = new Endpoint(clientId, oauth, "/streams");
        this.videos = new Endpoint(clientId, oauth, "/videos");
        this.clips = new Endpoint(clientId, oauth, "/clips");
    }

}
