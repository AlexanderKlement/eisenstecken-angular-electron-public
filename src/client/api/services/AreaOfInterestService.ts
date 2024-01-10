/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AreaOfInterestList } from '../models/AreaOfInterestList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AreaOfInterestService {
    /**
     * Get Area Of Interests
     * @returns AreaOfInterestList Successful Response
     * @throws ApiError
     */
    public static getAreaOfInterestsAreaOfInterestGet(): CancelablePromise<AreaOfInterestList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/area_of_interest/',
        });
    }
}
