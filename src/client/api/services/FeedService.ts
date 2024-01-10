/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Post } from '../models/Post';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeedService {
    /**
     * Get User Feed
     * @param offset
     * @param limit
     * @returns Post Successful Response
     * @throws ApiError
     */
    public static getUserFeedFeedUserGet(
        offset: number,
        limit: number,
    ): CancelablePromise<Array<Post>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feed/user',
            query: {
                'offset': offset,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Match Feed
     * @param matchId
     * @param offset
     * @param limit
     * @returns Post Successful Response
     * @throws ApiError
     */
    public static getMatchFeedFeedMatchMatchIdGet(
        matchId: number,
        offset: number,
        limit: number,
    ): CancelablePromise<Array<Post>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feed/match/{match_id}',
            path: {
                'match_id': matchId,
            },
            query: {
                'offset': offset,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
