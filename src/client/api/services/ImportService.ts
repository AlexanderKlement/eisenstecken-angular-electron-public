/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MatchImport } from '../models/MatchImport';
import type { MatchImportResultList } from '../models/MatchImportResultList';
import type { Task } from '../models/Task';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ImportService {
    /**
     * Import Match
     * @param requestBody
     * @param dryRun
     * @returns Task Successful Response
     * @throws ApiError
     */
    public static importMatchImportMatchPost(
        requestBody: Array<MatchImport>,
        dryRun: boolean = true,
    ): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/import/match',
            query: {
                'dry_run': dryRun,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Match Import Results
     * @param taskId
     * @returns MatchImportResultList Successful Response
     * @throws ApiError
     */
    public static getMatchImportResultsImportMatchTaskIdGet(
        taskId: string,
    ): CancelablePromise<MatchImportResultList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/import/match/{task_id}',
            path: {
                'task_id': taskId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
