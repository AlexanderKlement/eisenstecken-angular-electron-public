/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OutSummary } from '../models/OutSummary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OutService {
    /**
     * Get Out Summary
     * @param startDate
     * @param endDate
     * @returns OutSummary Successful Response
     * @throws ApiError
     */
    public static getOutSummaryOutSummaryGet(
        startDate: string,
        endDate: string,
    ): CancelablePromise<Array<OutSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/out/summary',
            query: {
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Redirect
     * @param key
     * @param userId
     * @returns void
     * @throws ApiError
     */
    public static redirectOutKeyUserIdGet(
        key: string,
        userId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/out/{key}/{user_id}',
            path: {
                'key': key,
                'user_id': userId,
            },
            errors: {
                307: `Successful Response`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Redirect Without User
     * @param key
     * @returns void
     * @throws ApiError
     */
    public static redirectWithoutUserOutKeyGet(
        key: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/out/{key}',
            path: {
                'key': key,
            },
            errors: {
                307: `Successful Response`,
                422: `Validation Error`,
            },
        });
    }
}
