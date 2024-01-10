/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ad } from '../models/Ad';
import type { BulkSearchResult } from '../models/BulkSearchResult';
import type { LeagueList } from '../models/LeagueList';
import type { LocationList } from '../models/LocationList';
import type { MatchListElementList } from '../models/MatchListElementList';
import type { PlayerSearchElementList } from '../models/PlayerSearchElementList';
import type { SearchRequest } from '../models/SearchRequest';
import type { SearchResult } from '../models/SearchResult';
import type { SearchTypeEnum } from '../models/SearchTypeEnum';
import type { TeamListElementList } from '../models/TeamListElementList';
import type { UserEssential } from '../models/UserEssential';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SearchService {
    /**
     * Search
     * @param query
     * @param length
     * @param offset
     * @returns SearchResult Successful Response
     * @throws ApiError
     */
    public static searchSearchQueryGet(
        query: string,
        length: number,
        offset: number,
    ): CancelablePromise<SearchResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/{query}',
            path: {
                'query': query,
            },
            query: {
                'length': length,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Team
     * @param query
     * @param length
     * @param offset
     * @param leagueId
     * @returns TeamListElementList Successful Response
     * @throws ApiError
     */
    public static searchTeamSearchTeamQueryGet(
        query: string,
        length: number,
        offset: number,
        leagueId?: number,
    ): CancelablePromise<TeamListElementList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/team/{query}',
            path: {
                'query': query,
            },
            query: {
                'length': length,
                'offset': offset,
                'league_id': leagueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search League
     * @param query
     * @param length
     * @param offset
     * @returns LeagueList Successful Response
     * @throws ApiError
     */
    public static searchLeagueSearchLeagueQueryGet(
        query: string,
        length: number,
        offset: number,
    ): CancelablePromise<LeagueList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/league/{query}',
            path: {
                'query': query,
            },
            query: {
                'length': length,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Player
     * @param query
     * @param length
     * @param offset
     * @param noTeam
     * @returns PlayerSearchElementList Successful Response
     * @throws ApiError
     */
    public static searchPlayerSearchPlayerQueryGet(
        query: string,
        length: number,
        offset: number,
        noTeam: boolean = true,
    ): CancelablePromise<PlayerSearchElementList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/player/{query}',
            path: {
                'query': query,
            },
            query: {
                'length': length,
                'offset': offset,
                'no_team': noTeam,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Location
     * @param query
     * @param length
     * @param offset
     * @returns LocationList Successful Response
     * @throws ApiError
     */
    public static searchLocationSearchLocationQueryGet(
        query: string,
        length: number,
        offset: number,
    ): CancelablePromise<LocationList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/location/{query}',
            path: {
                'query': query,
            },
            query: {
                'length': length,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Match
     * @param query
     * @param areaOfInterestId
     * @param leagueId
     * @param teamId
     * @param matchDay
     * @param dateFrom
     * @param dateTo
     * @param length
     * @param offset
     * @returns MatchListElementList Successful Response
     * @throws ApiError
     */
    public static searchMatchSearchMatchQueryGet(
        query: string,
        areaOfInterestId?: number,
        leagueId?: number,
        teamId?: number,
        matchDay?: number,
        dateFrom?: string,
        dateTo?: string,
        length: number = 100,
        offset?: number,
    ): CancelablePromise<MatchListElementList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/match/{query}',
            path: {
                'query': query,
            },
            query: {
                'area_of_interest_id': areaOfInterestId,
                'league_id': leagueId,
                'team_id': teamId,
                'match_day': matchDay,
                'date_from': dateFrom,
                'date_to': dateTo,
                'length': length,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search User
     * @param query
     * @param length
     * @param offset
     * @returns UserEssential Successful Response
     * @throws ApiError
     */
    public static searchUserSearchUserQueryGet(
        query: string,
        length: number,
        offset: number,
    ): CancelablePromise<UserEssential> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/user/{query}',
            path: {
                'query': query,
            },
            query: {
                'length': length,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Ad
     * @param query
     * @param length
     * @param offset
     * @returns Ad Successful Response
     * @throws ApiError
     */
    public static searchAdSearchAdQueryGet(
        query: string,
        length: number,
        offset: number,
    ): CancelablePromise<Array<Ad>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/ad/{query}',
            path: {
                'query': query,
            },
            query: {
                'length': length,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Bulk Search
     * @param searchType
     * @param requestBody
     * @returns BulkSearchResult Successful Response
     * @throws ApiError
     */
    public static bulkSearchSearchBulkPost(
        searchType: SearchTypeEnum,
        requestBody: Array<SearchRequest>,
    ): CancelablePromise<Array<BulkSearchResult>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/search/bulk',
            query: {
                'search_type': searchType,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
