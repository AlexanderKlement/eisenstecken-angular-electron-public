/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoalDistributionMatch } from '../models/GoalDistributionMatch';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GoalDistributionService {
    /**
     * Get Goal Distribution By Match
     * @param matchId
     * @returns GoalDistributionMatch Successful Response
     * @throws ApiError
     */
    public static getGoalDistributionByMatchGoalDistributionMatchMatchIdGet(
        matchId: number,
    ): CancelablePromise<GoalDistributionMatch> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/goal_distribution/match/{match_id}',
            path: {
                'match_id': matchId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
