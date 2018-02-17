//#region Twitch Response Base

export interface ITwitchErrorResponse {
    error: string;
    status: string;
    message: string;
}

export interface ITwitchSuccessResponse<T> {
    data: T;
}

export interface IPaginatedResponse {
    pagination: Pagination;
}

export class TwitchSuccessResponse<T> implements ITwitchSuccessResponse<T> {
    public data: T;
}

//#endregion

//#region users Endpoint

/**
 * Represents a Twitch user.
 * If it has the user:read:email scope, email will be returned and vice versa.
 */
export class User {
    /**
     * User’s broadcaster type: "partner", "affiliate", or "".
     */
    public broadcasterType: string;
    /**
     * User's channel description.
     */
    public description: string;
    /**
     * User's display name.
     */
    public displayName: string;
    /**
     * User’s email address. Returned if the request includes the user:read:edit scope.
     */
    public email?: string;
    /**
     * User's ID.
     */
    public id: string;
    /**
     * User's login name.
     */
    public login: string;
    /**
     * URL of the user's offline image.
     */
    public offlineImageUrl: string;
    /**
     * URL of the user's profile image.
     */
    public profileImageUrl: string;
    /**
     * User’s type: "staff", "admin", "global_mod", or "".
     */
    public type: string;
    /**
     * Total number of views of the user’s channel.
     */
    public viewCount: number;
}

/**
 * A result object from /users call.
 */
export class UserResult implements ITwitchSuccessResponse<User[]> {
    /**
     * Contains all of the user datas requested with query parameters.
     */
    public data: User[];
}

/**
 * Contains who followed another user at which time.
 */
export class Follow {
    /**
     * ID of the user following the to_id user.
     */
    public fromId: string;
    /**
     * ID of the user being followed by the from_id user.
     */
    public toId: string;
    /**
     * Date and time when the from_id user followed the to_id user.
     */
    public followedAt: string;
}

/**
 * Pagination object which contains the cursor.
 */
export class Pagination {
    /**
     * Where the cursor is at, from another view; which page you are at.
     */
    public cursor: string;
}

/**
 * Success Twitch API Response from /users/follows.
 */
export class UserFollowResult implements ITwitchSuccessResponse<Follow[]>, IPaginatedResponse {
    /**
     * Total number of items returned.
     * - If only from_id was in the request, this is the total number of followed users.
     * - If only to_id was in the request, this is the total number of followers.
     * - If both from_id and to_id were in the request, this is 1 (if the "from" user follows the "to" user) or 0.
     */
    public total: number;
    /**
     * The data contaning all follow datas.
     */
    public data: Follow[];
    /**
     * Current pagination as there might be a lot of pages for this.
     *
     * E.g. If user has 200 followers, you have to get it in 2 calls because it is 100 users for one call at maximum.
     */
    public pagination: Pagination;
}

/**
 * Contains the available query parameters for users endpoint.
 * A request can include a mixture of both login names and user IDs.
 */
export interface IUserQueryParameters {
    /**
     * User ID. Multiple user IDs can be specified. Limit: 100.
     */
    id?: string;
    /**
     * User login name. Multiple login names can be specified. Limit: 100.
     */
    login?: string;
}

/**
 * Contains the available query parameters for users/follows endpoint.
 * At minimum, from_id or to_id must be provided for a query to be valid.
 */
export interface IUserFollowsQueryParameters {
    /**
     * Cursor for forward pagination: tells the server where
     *  to start fetching the next set of results, in a multi-page response.
     */
    after?: string;
    /**
     * Cursor for backward pagination: tells the server where to
     *  start fetching the next set of results, in a multi-page response.
     */
    before?: string;
    /**
     * Maximum number of objects to return. Maximum: 100. Default: 20.
     */
    first?: number;
    /**
     * User ID. The request returns information about users who are being followed by the from_id user.
     */
    from_id?: string;
    /**
     * User ID. The request returns information about users who are following the to_id user.
     */
    to_id?: string;
}

/**
 * Present in a put request to update the user, must contain description field.
 */
export interface IUpdateDescriptionQueryParameters extends IUserQueryParameters {
    /**
     * The description to update with the user's one.
     */
    description: string;
}
//#endregion

//#region games Endpoint

/**
 * The required query parameters for the games call.
 * One of either id or name should be present.
 */
export interface IGameQueryParameters {
    /**
     * Game ID. At most 100 id values can be specified.
     */
    id?: string;
    /**
     * Game name. The name must be an exact match. For instance, "Pokemon" will not return a list
     * of Pokemon games; instead, query the specific
     * Pokemon game(s) in which you are interested. At most 100 name values can be specified.
     */
    name?: string;
}

/**
 * Game information by game ID or name.
 */
export class Game {
    /**
     * Template URL for the game’s box art.
     */
    public boxArtUrl: string;
    /**
     * Game ID.
     */
    public id: string;
    /**
     * Game name.
     */
    public name: string;
}

export class GameResponse {
    public data: Game[];
}

/**
 * Query parameters for getting the top games.
 */
export interface ITopGamesQueryParameters {
    /**
     * Cursor for forward pagination: tells the server where to start
     * fetching the next set of results, in a multi-page response.
     */
    after?: string;
    /**
     * Cursor for backward pagination: tells the server where to start fetching
     * the next set of results, in a multi-page response.
     */
    before?: string;
    /**
     * Maximum number of objects to return. Maximum: 100. Default: 20.
     */
    first?: number;
}

//#endregion

//#region streams Endpoint

/**
 * Optional query parameters for streams Endpoint.
 */
export interface IStreamQueryParameters {
    /**
     * Cursor for forward pagination: tells the server where to start fetching
     * the next set of results, in a multi-page response.
     */
    after?: string;
    /**
     * Cursor for backward pagination: tells the server where to start fetching the next set of results,
     * in a multi-page response.
     */
    before?: string;
    /**
     * Returns streams in a specified community ID. You can specify up to 100 IDs.
     */
    community_id?: string;
    /**
     * Maximum number of objects to return. Maximum: 100. Default: 20.
     */
    first?: number;
    /**
     * Returns streams broadcasting a specified game ID. You can specify up to 100 IDs.
     */
    game_id?: string;
    /**
     * Stream language. You can specify up to 100 languages.
     */
    language?: string;
    /**
     * Stream type: "all", "live", "vodcast". Default: "all".
     */
    type?: string;
    /**
     * Returns streams broadcast by one or more specified user IDs. You can specify up to 100 IDs.
     */
    user_id?: string;
    /**
     * Returns streams broadcast by one or more specified user login names. You can specify up to 100 names.
     */
    user_login?: string;
}

/**
 * A stream data returned by streams Endpoint.
 */
export class Stream {
    /**
     * Array of community IDs.
     */
    public communityIds: string[];
    /**
     * ID of the game being played on the stream.
     */
    public gameId: string;
    /**
     * Stream ID.
     */
    public id: string;
    /**
     * Stream language.
     */
    public language: string;
    /**
     * UTC timestamp.
     */
    public startedAt: string;
    /**
     * Thumbnail URL of the stream. All image URLs have variable width and height. You can replace
     *  {width} and {height} with any values to get that size image
     */
    public thumbnailUrl: string;
    /**
     * Stream title.
     */
    public title: string;
    /**
     * Stream type: "live", "vodcast", or "".
     */
    public type: string;
    /**
     * ID of the user who is streaming.
     */
    public userId: string;
    /**
     * Number of viewers watching the stream at the time of the query.
     */
    public viewerCount: number;
}

/**
 * The response returned by streams Endpoint.
 */
export class StreamResponse implements ITwitchSuccessResponse<Stream[]>, IPaginatedResponse {
    /**
     * Current page of the multipage response.
     */
    public pagination: Pagination;
    /**
     * All requested streams.
     */
    public data: Stream[];
}
//#endregion

//#region videos Endpoint

/**
 * Optional and required query parameters for videos Endpoint.
 * Each request must specify one or more video ids, one user_id, or one game_id.
 */
export interface IVideosQueryParameters {
    /**
     * Cursor for forward pagination: tells the server where to start
     *  fetching the next set of results, in a multi-page response.
     */
    after?: string;
    /**
     * Cursor for backward pagination: tells the server where to start
     *  fetching the next set of results, in a multi-page response.
     */
    before?: string;
    /**
     * Number of values to be returned when getting videos by user or game ID. Limit: 100. Default: 20.
     */
    first?: number;
    /**
     * ID of the game the video is of. Limit 1.
     */
    game_id?: string;
    /**
     * ID of the video being queried. Limit: 100. If this is specified, you
     *  cannot use any of the optional query string parameters below (other id parameters).
     */
    id?: string;
    /**
     * Language of the video being queried. Limit: 1.
     */
    language?: string;
    /**
     * Period during which the video was created. Valid values: "all", "day", "month", and "week". Default: "all".
     */
    period?: string;
    /**
     * ID of the user who owns the video. Limit 1.
     */
    user_id?: string;
    /**
     * Sort order of the videos. Valid values: "time", "trending", and "views". Default: "time".
     */
    sort?: string;
    /**
     * Type of video. Valid values: "all", "upload", "archive", and "highlight". Default: "all".
     */
    type?: string;
}

/**
 * A video got from videos Endpoint.
 */
export class Video {
    /**
     * Date when the video was created.
     */
    public createdAt: string;
    /**
     * Description of the video.
     */
    public description: string;
    /**
     * Length of the video.
     */
    public duration: string;
    /**
     * ID of the video.
     */
    public id: string;
    /**
     * Language of the video.
     */
    public language: string;
    /**
     * Date when the video was published.
     */
    public publishedAt: string;
    /**
     * Template URL for the thumbnail of the video.
     */
    public thumbnailUrl: string;
    /**
     * Title of the video.
     */
    public title: string;
    /**
     * ID of the user who owns the video.
     */
    public userId: string;
    /**
     * Number of times the video has been viewed.
     */
    public viewCount: number;
}

/**
 * Data got from videos Endpoint.
 */
export class VideoResponse implements IPaginatedResponse, ITwitchSuccessResponse<Video[]> {
    /**
     * List of video datas.
     */
    public data: Video[];
    /**
     * A cursor value, to be used in a subsequent request to specify the starting point of the next set of results.
     */
    public pagination: Pagination;
}

//#endregion

//#region clips Endpoint

// tslint:disable-next-line:no-empty-interface
export interface IClipQueryParameters { }

/**
 * Query parameters to create a clip, used with a post request to clips Endpoint.
 */
export interface ICreateClipQueryParameters extends IClipQueryParameters {
    /**
     * ID of the stream from which the clip will be made.
     */
    broadcaster_id: string;
}

/**
 * PLEASE cast this to either Clip or CreatedClip.
 *
 * This is meant to be a base
 */
export interface IClip {
    id: string;
}

/**
 * Got via a post request to clips Endpoint, as a clip is created.
 */
export class CreatedClip implements IClip {
    /**,
     * URL of the edit page for the clip.
     */
    public editUrl: string;
    /**
     * ID of the clip that was created.
     */
    public id: string;
}

/**
 * Passed with a get response to clips Endpoint.
 */
export interface IGetClipQueryParameters extends IClipQueryParameters {
    /**
     * ID of the clip being queried. Limit 1.
     */
    id?: string;
}

/**
 * Clip data got from clips Endpoint.
 */
export class Clip implements IClip {
    /**
     * User ID of the stream from which the clip was created.
     */
    public broadcasterId: string;
    /**
     * Date when the clip was created.
     */
    public createdAt: string;
    /**
     * ID of the user who created the clip.
     */
    public creatorId: string;
    /**
     * URL to embed the clip.
     */
    public embedUrl: string;
    /**
     * ID of the game assigned to the stream when the clip was created.
     */
    public gameId: string;
    /**
     * ID of the clip being queried.
     */
    public id: string;
    /**
     * Language of the stream from which the clip was created.
     */
    public language: string;
    /**
     * URL of the clip thumbnail.
     */
    public thumbnailUrl: string;
    /**
     * Title of the clip.
     */
    public title: string;
    /**
     * URL where the clip can be viewed.
     */
    public url: string;
    /**
     * ID of the video from which the clip was created.
     */
    public videoId: string;
    /**
     * Number of times the clip has been viewed.
     */
    public viewCount: number;
}

//#endregion
