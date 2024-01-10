/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MatchLocationEnum } from '../models/MatchLocationEnum';
import type { StandingList } from '../models/StandingList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StandingService {
    /**
     * Get Standing By League
     * @param leagueId
     * @returns StandingList Successful Response
     * @throws ApiError
     */
    public static getStandingByLeagueStandingLeagueAllLeagueIdGet(
        leagueId: number,
    ): CancelablePromise<Record<string, StandingList>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/standing/league/all/{league_id}',
            path: {
                'league_id': leagueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Standing By League
     * @param leagueId
     * @param matchLocationEnum
     * @returns StandingList Successful Response
     * @throws ApiError
     */
    public static getStandingByLeagueStandingLeagueLeagueIdGet(
        leagueId: number,
        matchLocationEnum: MatchLocationEnum,
    ): CancelablePromise<StandingList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/standing/league/{league_id}',
            path: {
                'league_id': leagueId,
            },
            query: {
                'match_location_enum': matchLocationEnum,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Standing By Teams
     * @param team1Id
     * @param team2Id
     * @returns StandingList Successful Response
     * @throws ApiError
     */
    public static getStandingByTeamsStandingTeamsTeam1IdTeam2IdGet(
        team1Id: number,
        team2Id: number,
    ): CancelablePromise<StandingList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/standing/teams/{team_1_id}/{team_2_id}',
            path: {
                'team_1_id': team1Id,
                'team_2_id': team2Id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Standing History Of Team
     * @param teamId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static getStandingHistoryOfTeamStandingHistoryTeamTeamIdGet(
        teamId: number,
    ): CancelablePromise<Record<string, number>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/standing/history/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
