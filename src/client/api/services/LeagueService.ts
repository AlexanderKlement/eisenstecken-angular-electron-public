/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { League } from '../models/League';
import type { LeagueCreate } from '../models/LeagueCreate';
import type { LeagueList } from '../models/LeagueList';
import type { LeagueListElement } from '../models/LeagueListElement';
import type { LeagueMatchList } from '../models/LeagueMatchList';
import type { LeaguePatch } from '../models/LeaguePatch';
import type { MoveEnum } from '../models/MoveEnum';
import type { SportEnum } from '../models/SportEnum';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LeagueService {
    /**
     * Get League By Id
     * @param leagueId
     * @returns League Successful Response
     * @throws ApiError
     */
    public static getLeagueByIdLeagueLeagueIdGet(
        leagueId: number,
    ): CancelablePromise<League> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/league/{league_id}',
            path: {
                'league_id': leagueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch League
     * @param leagueId
     * @param requestBody
     * @returns League Successful Response
     * @throws ApiError
     */
    public static patchLeagueLeagueLeagueIdPatch(
        leagueId: number,
        requestBody: LeaguePatch,
    ): CancelablePromise<League> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/league/{league_id}',
            path: {
                'league_id': leagueId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete League
     * @param leagueId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static deleteLeagueLeagueLeagueIdDelete(
        leagueId: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/league/{league_id}',
            path: {
                'league_id': leagueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Leagues
     * @param areaOfInterestId
     * @param sports
     * @param activeOnly
     * @returns LeagueList Successful Response
     * @throws ApiError
     */
    public static getLeaguesLeagueGet(
        areaOfInterestId: number,
        sports?: SportEnum,
        activeOnly: boolean = true,
    ): CancelablePromise<LeagueList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/league/',
            query: {
                'area_of_interest_id': areaOfInterestId,
                'sports': sports,
                'active_only': activeOnly,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create League
     * @param requestBody
     * @returns League Successful Response
     * @throws ApiError
     */
    public static createLeagueLeaguePost(
        requestBody: LeagueCreate,
    ): CancelablePromise<League> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/league/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Team To League
     * @param leagueId
     * @param teamId
     * @returns League Successful Response
     * @throws ApiError
     */
    public static addTeamToLeagueLeagueAddTeamPost(
        leagueId: number,
        teamId: number,
    ): CancelablePromise<League> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/league/add_team',
            query: {
                'league_id': leagueId,
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Team From League
     * @param leagueId
     * @param teamId
     * @returns League Successful Response
     * @throws ApiError
     */
    public static removeTeamFromLeagueLeagueRemoveTeamPost(
        leagueId: number,
        teamId: number,
    ): CancelablePromise<League> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/league/remove_team',
            query: {
                'league_id': leagueId,
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Multiple Leagues
     * @param requestBody
     * @returns League Successful Response
     * @throws ApiError
     */
    public static createMultipleLeaguesLeagueMultiplePost(
        requestBody: Array<LeagueCreate>,
    ): CancelablePromise<Array<League>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/league/multiple',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Order Leagues
     * @param requestBody
     * @returns LeagueListElement Successful Response
     * @throws ApiError
     */
    public static orderLeaguesLeagueOrderPost(
        requestBody: Array<number>,
    ): CancelablePromise<Array<LeagueListElement>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/league/order',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Move League
     * @param leagueId
     * @param direction
     * @param areaOfInterestId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static moveLeagueLeagueMovePost(
        leagueId: number,
        direction: MoveEnum,
        areaOfInterestId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/league/move',
            query: {
                'league_id': leagueId,
                'direction': direction,
                'area_of_interest_id': areaOfInterestId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get League Match By Date
     * @param date
     * @param areaOfInterest
     * @param sports
     * @returns LeagueMatchList Successful Response
     * @throws ApiError
     */
    public static getLeagueMatchByDateLeagueMatchesDateGet(
        date: string,
        areaOfInterest: number,
        sports?: SportEnum,
    ): CancelablePromise<LeagueMatchList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/league_matches/date',
            query: {
                'date': date,
                'area_of_interest': areaOfInterest,
                'sports': sports,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get League Match By Team
     * @param teamId
     * @param areaOfInterest
     * @returns LeagueMatchList Successful Response
     * @throws ApiError
     */
    public static getLeagueMatchByTeamLeagueMatchesTeamTeamIdGet(
        teamId: number,
        areaOfInterest: number,
    ): CancelablePromise<LeagueMatchList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/league_matches/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            query: {
                'area_of_interest': areaOfInterest,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
