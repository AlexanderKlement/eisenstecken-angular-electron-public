/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExternalVideo } from '../models/ExternalVideo';
import type { ExternalVideoCreate } from '../models/ExternalVideoCreate';
import type { ExternalVideoCreateRaw } from '../models/ExternalVideoCreateRaw';
import type { ExternalVideoList } from '../models/ExternalVideoList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExternalVideoService {
    /**
     * Get External Videos
     * @param limit
     * @param offset
     * @param areaOfInterestId
     * @returns ExternalVideoList Successful Response
     * @throws ApiError
     */
    public static getExternalVideosExternalVideoGet(
        limit: number,
        offset: number,
        areaOfInterestId: number,
    ): CancelablePromise<ExternalVideoList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external_video/',
            query: {
                'limit': limit,
                'offset': offset,
                'area_of_interest_id': areaOfInterestId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create External Video
     * @param requestBody
     * @returns ExternalVideo Successful Response
     * @throws ApiError
     */
    public static createExternalVideoExternalVideoPost(
        requestBody: ExternalVideoCreate,
    ): CancelablePromise<ExternalVideo> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/external_video/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create External Video
     * @param requestBody
     * @returns ExternalVideo Successful Response
     * @throws ApiError
     */
    public static createExternalVideoExternalVideoRawPost(
        requestBody: ExternalVideoCreateRaw,
    ): CancelablePromise<ExternalVideo> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/external_video/raw',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
