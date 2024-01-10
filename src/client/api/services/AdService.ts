/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ad } from '../models/Ad';
import type { AdCreate } from '../models/AdCreate';
import type { AdList } from '../models/AdList';
import type { AdPatch } from '../models/AdPatch';
import type { AdPositionEnum } from '../models/AdPositionEnum';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdService {
    /**
     * Get Ad
     * @param adId
     * @returns Ad Successful Response
     * @throws ApiError
     */
    public static getAdAdAdIdGet(
        adId: number,
    ): CancelablePromise<Ad> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ad/{ad_id}',
            path: {
                'ad_id': adId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Ad
     * @param adId
     * @param requestBody
     * @returns Ad Successful Response
     * @throws ApiError
     */
    public static patchAdAdAdIdPatch(
        adId: number,
        requestBody: AdPatch,
    ): CancelablePromise<Ad> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/ad/{ad_id}',
            path: {
                'ad_id': adId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Ad
     * @param adId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static deleteAdAdAdIdDelete(
        adId: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/ad/{ad_id}',
            path: {
                'ad_id': adId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Ads By Position
     * @param position
     * @param areaOfInterestId
     * @returns AdList Successful Response
     * @throws ApiError
     */
    public static getAdsByPositionAdPositionPositionGet(
        position: AdPositionEnum,
        areaOfInterestId?: number,
    ): CancelablePromise<AdList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ad/position/{position}',
            path: {
                'position': position,
            },
            query: {
                'area_of_interest_id': areaOfInterestId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Ad
     * @param requestBody
     * @param areaOfInterestId
     * @returns Ad Successful Response
     * @throws ApiError
     */
    public static createAdAdPost(
        requestBody: AdCreate,
        areaOfInterestId?: number,
    ): CancelablePromise<Ad> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ad/',
            query: {
                'area_of_interest_id': areaOfInterestId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Multiple Ads
     * @param requestBody
     * @returns Ad Successful Response
     * @throws ApiError
     */
    public static createMultipleAdsAdMultiplePost(
        requestBody: Array<AdCreate>,
    ): CancelablePromise<Array<Ad>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ad/multiple',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
