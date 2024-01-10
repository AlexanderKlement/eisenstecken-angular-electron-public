/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulletinCreate } from '../models/BulletinCreate';
import type { BulletinList } from '../models/BulletinList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BulletinService {
    /**
     * Create Bulletin
     * @param requestBody
     * @returns BulletinList Successful Response
     * @throws ApiError
     */
    public static createBulletinBulletinPost(
        requestBody: BulletinCreate,
    ): CancelablePromise<BulletinList> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bulletin/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Bulletins
     * @param areaOfInterestId
     * @param limit
     * @param offset
     * @returns BulletinList Successful Response
     * @throws ApiError
     */
    public static getBulletinsBulletinGet(
        areaOfInterestId: number,
        limit: number = 10,
        offset?: number,
    ): CancelablePromise<BulletinList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bulletin/',
            query: {
                'area_of_interest_id': areaOfInterestId,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
