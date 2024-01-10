/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlayerPositionEnum } from '../models/PlayerPositionEnum';
import type { Team } from '../models/Team';
import type { TeamCreate } from '../models/TeamCreate';
import type { TeamListElement } from '../models/TeamListElement';
import type { TeamListElementList } from '../models/TeamListElementList';
import type { TeamPatch } from '../models/TeamPatch';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TeamService {
    /**
     * Get Team By Id
     * @param teamId
     * @returns Team Successful Response
     * @throws ApiError
     */
    public static getTeamByIdTeamTeamIdGet(
        teamId: number,
    ): CancelablePromise<Team> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Team
     * @param teamId
     * @param requestBody
     * @returns Team Successful Response
     * @throws ApiError
     */
    public static patchTeamTeamTeamIdPatch(
        teamId: number,
        requestBody: TeamPatch,
    ): CancelablePromise<Team> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Team
     * @param teamId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static deleteTeamTeamTeamIdDelete(
        teamId: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Teams
     * @param leagueId
     * @returns TeamListElementList Successful Response
     * @throws ApiError
     */
    public static getTeamsTeamGet(
        leagueId: number,
    ): CancelablePromise<TeamListElementList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/team/',
            query: {
                'league_id': leagueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Team
     * @param requestBody
     * @returns Team Successful Response
     * @throws ApiError
     */
    public static createTeamTeamPost(
        requestBody: TeamCreate,
    ): CancelablePromise<Team> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/team/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Team By Player And League
     * @param playerId
     * @param leagueId
     * @returns TeamListElement Successful Response
     * @throws ApiError
     */
    public static getTeamByPlayerAndLeagueTeamPlayerPlayerIdLeagueLeagueIdGet(
        playerId: number,
        leagueId: number,
    ): CancelablePromise<TeamListElement> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/team/player/{player_id}/league/{league_id}',
            path: {
                'player_id': playerId,
                'league_id': leagueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Player To Team
     * @param playerId
     * @param teamId
     * @param position
     * @returns Team Successful Response
     * @throws ApiError
     */
    public static addPlayerToTeamTeamTeamIdAddPlayerIdPost(
        playerId: number,
        teamId: number,
        position: PlayerPositionEnum,
    ): CancelablePromise<Team> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/team/{team_id}/add/{player_id}',
            path: {
                'player_id': playerId,
                'team_id': teamId,
            },
            query: {
                'position': position,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Player From Team
     * @param playerId
     * @param teamId
     * @returns Team Successful Response
     * @throws ApiError
     */
    public static removePlayerFromTeamTeamTeamIdRemovePlayerIdPost(
        playerId: number,
        teamId: number,
    ): CancelablePromise<Team> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/team/{team_id}/remove/{player_id}',
            path: {
                'player_id': playerId,
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Change Player Position
     * @param playerId
     * @param teamId
     * @param position
     * @returns Team Successful Response
     * @throws ApiError
     */
    public static changePlayerPositionTeamTeamIdChangePositionPositionPlayerIdPost(
        playerId: number,
        teamId: number,
        position: PlayerPositionEnum,
    ): CancelablePromise<Team> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/team/{team_id}/change/position/{position}/{player_id}',
            path: {
                'player_id': playerId,
                'team_id': teamId,
                'position': position,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Multiple Teams
     * @param requestBody
     * @returns Team Successful Response
     * @throws ApiError
     */
    public static createMultipleTeamsTeamMultiplePost(
        requestBody: Array<TeamCreate>,
    ): CancelablePromise<Array<Team>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/team/multiple',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
