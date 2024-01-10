/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeagueMatchList } from '../models/LeagueMatchList';
import type { Match } from '../models/Match';
import type { MatchCreate } from '../models/MatchCreate';
import type { MatchListElementList } from '../models/MatchListElementList';
import type { MatchPatch } from '../models/MatchPatch';
import type { SportEnum } from '../models/SportEnum';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MatchService {
    /**
     * Get Match
     * @param matchId
     * @returns Match Successful Response
     * @throws ApiError
     */
    public static getMatchMatchMatchIdGet(
        matchId: number,
    ): CancelablePromise<Match> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/match/{match_id}',
            path: {
                'match_id': matchId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Match
     * @param matchId
     * @param requestBody
     * @returns Match Successful Response
     * @throws ApiError
     */
    public static patchMatchMatchMatchIdPatch(
        matchId: number,
        requestBody: MatchPatch,
    ): CancelablePromise<Match> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/match/{match_id}',
            path: {
                'match_id': matchId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Match
     * @param matchId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static deleteMatchMatchMatchIdDelete(
        matchId: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/match/{match_id}',
            path: {
                'match_id': matchId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Matches By Team
     * @param teamId
     * @param limit
     * @param playedOnly
     * @param notCancelledOnly
     * @returns MatchListElementList Successful Response
     * @throws ApiError
     */
    public static getMatchesByTeamMatchTeamTeamIdGet(
        teamId: number,
        limit: number,
        playedOnly: boolean,
        notCancelledOnly: boolean = false,
    ): CancelablePromise<MatchListElementList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/match/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            query: {
                'limit': limit,
                'played_only': playedOnly,
                'not_cancelled_only': notCancelledOnly,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Matches By League And Date
     * @param leagueId
     * @param matchDate
     * @returns MatchListElementList Successful Response
     * @throws ApiError
     */
    public static getMatchesByLeagueAndDateMatchLeagueLeagueIdDateMatchDateGet(
        leagueId: number,
        matchDate: string,
    ): CancelablePromise<MatchListElementList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/match/league/{league_id}/date/{match_date}',
            path: {
                'league_id': leagueId,
                'match_date': matchDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Matches By League And Match Day
     * @param leagueId
     * @param matchDay
     * @returns MatchListElementList Successful Response
     * @throws ApiError
     */
    public static getMatchesByLeagueAndMatchDayMatchLeagueLeagueIdMatchDayMatchDayGet(
        leagueId: number,
        matchDay: number,
    ): CancelablePromise<MatchListElementList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/match/league/{league_id}/match_day/{match_day}',
            path: {
                'league_id': leagueId,
                'match_day': matchDay,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Matches By League
     * @param leagueId
     * @returns MatchListElementList Successful Response
     * @throws ApiError
     */
    public static getMatchesByLeagueMatchLeagueLeagueIdGet(
        leagueId: number,
    ): CancelablePromise<MatchListElementList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/match/league/{league_id}',
            path: {
                'league_id': leagueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Match History
     * @param matchId
     * @param limit
     * @returns MatchListElementList Successful Response
     * @throws ApiError
     */
    public static getMatchHistoryMatchHistoryMatchIdGet(
        matchId: number,
        limit: number,
    ): CancelablePromise<MatchListElementList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/match/history/{match_id}',
            path: {
                'match_id': matchId,
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
     * Create Match
     * @param requestBody
     * @returns Match Successful Response
     * @throws ApiError
     */
    public static createMatchMatchPost(
        requestBody: MatchCreate,
    ): CancelablePromise<Match> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/match/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Multiple Matches
     * @param requestBody
     * @returns Match Successful Response
     * @throws ApiError
     */
    public static createMultipleMatchesMatchMultiplePost(
        requestBody: Array<MatchCreate>,
    ): CancelablePromise<Array<Match>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/match/multiple',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Start Match
     * @param matchId
     * @param minutes
     * @returns Match Successful Response
     * @throws ApiError
     */
    public static startMatchMatchStartMatchIdPost(
        matchId: number,
        minutes: number,
    ): CancelablePromise<Match> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/match/start/{match_id}',
            path: {
                'match_id': matchId,
            },
            query: {
                'minutes': minutes,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancel Match
     * @param matchId
     * @returns Match Successful Response
     * @throws ApiError
     */
    public static cancelMatchMatchCancelMatchIdPost(
        matchId: number,
    ): CancelablePromise<Match> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/match/cancel/{match_id}',
            path: {
                'match_id': matchId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Uncancel Match
     * @param matchId
     * @param newStartTime
     * @returns Match Successful Response
     * @throws ApiError
     */
    public static uncancelMatchMatchUncancelMatchIdPost(
        matchId: number,
        newStartTime: (string | null),
    ): CancelablePromise<Match> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/match/uncancel/{match_id}',
            path: {
                'match_id': matchId,
            },
            query: {
                'new_start_time': newStartTime,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Match Report
     * @param matchId
     * @param report
     * @returns Match Successful Response
     * @throws ApiError
     */
    public static setMatchReportMatchReportMatchIdPut(
        matchId: number,
        report: string,
    ): CancelablePromise<Match> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/match/report/{match_id}',
            path: {
                'match_id': matchId,
            },
            query: {
                'report': report,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Minutes
     * @param matchId
     * @param minutes
     * @returns Match Successful Response
     * @throws ApiError
     */
    public static addMinutesMatchAddMatchIdMinutesPost(
        matchId: number,
        minutes: number,
    ): CancelablePromise<Match> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/match/add/{match_id}/{minutes}',
            path: {
                'match_id': matchId,
                'minutes': minutes,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Finish Match
     * @param matchId
     * @returns Match Successful Response
     * @throws ApiError
     */
    public static finishMatchMatchFinishMatchIdPost(
        matchId: number,
    ): CancelablePromise<Match> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/match/finish/{match_id}',
            path: {
                'match_id': matchId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Random Match Id
     * @returns number Successful Response
     * @throws ApiError
     */
    public static getRandomMatchIdMatchRandomGet(): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/match/random',
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
