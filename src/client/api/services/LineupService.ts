/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Lineup } from '../models/Lineup';
import type { LineupCreate } from '../models/LineupCreate';
import type { LineupTypeList } from '../models/LineupTypeList';
import type { MatchLocationEnum } from '../models/MatchLocationEnum';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LineupService {
    /**
     * Get Lineup By Match And Team
     * @param matchId
     * @param team
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getLineupByMatchAndTeamLineupMatchMatchIdTeamGet(
        matchId: number,
        team: MatchLocationEnum,
    ): CancelablePromise<(Lineup | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lineup/match/{match_id}/{team}',
            path: {
                'match_id': matchId,
                'team': team,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Put Lineup By Match And Team
     * @param matchId
     * @param team
     * @param requestBody
     * @returns Lineup Successful Response
     * @throws ApiError
     */
    public static putLineupByMatchAndTeamLineupMatchMatchIdTeamPut(
        matchId: number,
        team: MatchLocationEnum,
        requestBody: LineupCreate,
    ): CancelablePromise<Lineup> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/lineup/match/{match_id}/{team}',
            path: {
                'match_id': matchId,
                'team': team,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Last Lineup By Team
     * @param teamId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getLastLineupByTeamLineupTeamTeamIdGet(
        teamId: number,
    ): CancelablePromise<(Lineup | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lineup/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Lineup Types
     * @returns LineupTypeList Successful Response
     * @throws ApiError
     */
    public static getLineupTypesLineupTypesGet(): CancelablePromise<LineupTypeList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lineup/types',
        });
    }
}
