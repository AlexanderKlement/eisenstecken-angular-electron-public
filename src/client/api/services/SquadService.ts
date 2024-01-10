/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SquadList } from '../models/SquadList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SquadService {
    /**
     * Get Squad
     * @param teamId
     * @returns SquadList Successful Response
     * @throws ApiError
     */
    public static getSquadSquadTeamIdGet(
        teamId: number,
    ): CancelablePromise<SquadList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/squad/{team_id}',
            path: {
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
