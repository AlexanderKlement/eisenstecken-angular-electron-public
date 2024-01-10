/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlayerStatisticDetail } from '../models/PlayerStatisticDetail';
import type { PlayerStatisticList } from '../models/PlayerStatisticList';
import type { SquadStatisticList } from '../models/SquadStatisticList';
import type { StatisticKeyEnum } from '../models/StatisticKeyEnum';
import type { TeamStatisticDetail } from '../models/TeamStatisticDetail';
import type { TeamStatisticList } from '../models/TeamStatisticList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatisticsService {
    /**
     * Get Team Statistics
     * @param leagueId
     * @returns TeamStatisticList Successful Response
     * @throws ApiError
     */
    public static getTeamStatisticsStatisticsTeamLeagueLeagueIdGet(
        leagueId: number,
    ): CancelablePromise<TeamStatisticList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/team/league/{league_id}',
            path: {
                'league_id': leagueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Team Statistics Detail
     * @param leagueId
     * @param statisticKey
     * @returns TeamStatisticDetail Successful Response
     * @throws ApiError
     */
    public static getTeamStatisticsDetailStatisticsTeamLeagueLeagueIdDetailStatisticKeyGet(
        leagueId: number,
        statisticKey: StatisticKeyEnum,
    ): CancelablePromise<TeamStatisticDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/team/league/{league_id}/detail/{statistic_key}',
            path: {
                'league_id': leagueId,
                'statistic_key': statisticKey,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Player Statistics League
     * @param leagueId
     * @returns PlayerStatisticList Successful Response
     * @throws ApiError
     */
    public static getPlayerStatisticsLeagueStatisticsPlayerLeagueLeagueIdGet(
        leagueId: number,
    ): CancelablePromise<PlayerStatisticList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/player/league/{league_id}',
            path: {
                'league_id': leagueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Player Statistics League Detail
     * @param leagueId
     * @param statisticKey
     * @param limit
     * @returns PlayerStatisticDetail Successful Response
     * @throws ApiError
     */
    public static getPlayerStatisticsLeagueDetailStatisticsPlayerLeagueLeagueIdDetailStatisticKeyGet(
        leagueId: number,
        statisticKey: StatisticKeyEnum,
        limit: number,
    ): CancelablePromise<PlayerStatisticDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/player/league/{league_id}/detail/{statistic_key}',
            path: {
                'league_id': leagueId,
                'statistic_key': statisticKey,
            },
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Player Statistics Match Detail
     * @param matchId
     * @param statisticKey
     * @param limit
     * @returns PlayerStatisticDetail Successful Response
     * @throws ApiError
     */
    public static getPlayerStatisticsMatchDetailStatisticsPlayerMatchMatchIdDetailStatisticKeyGet(
        matchId: number,
        statisticKey: StatisticKeyEnum,
        limit: number,
    ): CancelablePromise<PlayerStatisticDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/player/match/{match_id}/detail/{statistic_key}',
            path: {
                'match_id': matchId,
                'statistic_key': statisticKey,
            },
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Squad Statistic
     * @param teamId
     * @returns SquadStatisticList Successful Response
     * @throws ApiError
     */
    public static getSquadStatisticStatisticsSquadTeamTeamIdGet(
        teamId: number,
    ): CancelablePromise<SquadStatisticList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/squad/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Squad Statistics Detail
     * @param teamId
     * @param statisticKey
     * @returns PlayerStatisticDetail Successful Response
     * @throws ApiError
     */
    public static getSquadStatisticsDetailStatisticsSquadTeamTeamIdDetailStatisticKeyGet(
        teamId: number,
        statisticKey: StatisticKeyEnum,
    ): CancelablePromise<PlayerStatisticDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/squad/team/{team_id}/detail/{statistic_key}',
            path: {
                'team_id': teamId,
                'statistic_key': statisticKey,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
