/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SportEnum } from '../models/SportEnum';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SportService {
    /**
     * Get Sports
     * @returns SportEnum Successful Response
     * @throws ApiError
     */
    public static getSportsSportGet(): CancelablePromise<Array<SportEnum>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sport/',
        });
    }
}
