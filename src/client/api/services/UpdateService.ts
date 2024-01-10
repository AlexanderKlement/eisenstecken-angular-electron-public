/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UpdateService {
    /**
     * Update
     * @param dryRun
     * @param useWorker
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateUpdateUpdateGet(
        dryRun: boolean = true,
        useWorker: boolean = false,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/update/update',
            query: {
                'dry_run': dryRun,
                'use_worker': useWorker,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
