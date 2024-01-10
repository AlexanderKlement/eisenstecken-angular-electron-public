/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Lineup } from '../models/Lineup';
import type { ManOfTheMatch } from '../models/ManOfTheMatch';
import type { ManOfTheMatchVote } from '../models/ManOfTheMatchVote';
import type { PlayerSquadElementList } from '../models/PlayerSquadElementList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ManOfTheMatchService {
    /**
     * Get Team Of The Week
     * @param leagueId
     * @param matchDay
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTeamOfTheWeekManOfTheMatchTeamLeagueIdMatchdayMatchDayGet(
        leagueId: number,
        matchDay: number,
    ): CancelablePromise<(Lineup | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/man_of_the_match/team/{league_id}/matchday/{match_day}',
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
     * Get Man Of The Match Voting By Match
     * @param matchId
     * @param limit
     * @returns ManOfTheMatch Successful Response
     * @throws ApiError
     */
    public static getManOfTheMatchVotingByMatchManOfTheMatchMatchIdGet(
        matchId: number,
        limit: number,
    ): CancelablePromise<ManOfTheMatch> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/man_of_the_match/{match_id}',
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
     * Vote Match
     * @param limit
     * @param requestBody
     * @returns ManOfTheMatch Successful Response
     * @throws ApiError
     */
    public static voteMatchManOfTheMatchPost(
        limit: number,
        requestBody: ManOfTheMatchVote,
    ): CancelablePromise<ManOfTheMatch> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/man_of_the_match/',
            query: {
                'limit': limit,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Focused Players
     * @param matchId
     * @param teamId
     * @param limitPlayers
     * @param amountMatches
     * @returns PlayerSquadElementList Successful Response
     * @throws ApiError
     */
    public static getFocusedPlayersManOfTheMatchFocusMatchIdGet(
        matchId: number,
        teamId: number,
        limitPlayers: number,
        amountMatches: number,
    ): CancelablePromise<PlayerSquadElementList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/man_of_the_match/focus/{match_id}',
            path: {
                'match_id': matchId,
            },
            query: {
                'team_id': teamId,
                'limit_players': limitPlayers,
                'amount_matches': amountMatches,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
