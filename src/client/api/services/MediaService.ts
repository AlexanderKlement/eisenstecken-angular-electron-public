/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MediaService {
    /**
     * Download File
     * @param formatId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadFileMediaFormatIdGet(
        formatId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media/{format_id}',
            path: {
                'format_id': formatId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
