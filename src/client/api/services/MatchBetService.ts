/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MatchBetUserVote } from '../models/MatchBetUserVote';
import type { MatchBetVoting } from '../models/MatchBetVoting';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MatchBetService {
    /**
     * Get Match Bet Voting By Match
     * @param matchId
     * @returns MatchBetVoting Successful Response
     * @throws ApiError
     */
    public static getMatchBetVotingByMatchMatchBetMatchIdGet(
        matchId: number,
    ): CancelablePromise<MatchBetVoting> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/match_bet/{match_id}',
            path: {
                'match_id': matchId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Vote Match
     * @param requestBody
     * @returns MatchBetVoting Successful Response
     * @throws ApiError
     */
    public static voteMatchMatchBetPut(
        requestBody: MatchBetUserVote,
    ): CancelablePromise<MatchBetVoting> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/match_bet/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
