/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExportService {
    /**
     * Export Player Score
     * @param areaOfInterestId
     * @param matchDay
     * @param useWorker
     * @returns string Successful Response
     * @throws ApiError
     */
    public static exportPlayerScoreExportPlayerScoreAreaOfInterestIdPost(
        areaOfInterestId: number,
        matchDay?: number,
        useWorker: boolean = true,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/export/player_score/{area_of_interest_id}',
            path: {
                'area_of_interest_id': areaOfInterestId,
            },
            query: {
                'match_day': matchDay,
                'use_worker': useWorker,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
