/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Player } from '../models/Player';
import type { PlayerCard } from '../models/PlayerCard';
import type { PlayerCreate } from '../models/PlayerCreate';
import type { PlayerPatch } from '../models/PlayerPatch';
import type { PlayerPositionList } from '../models/PlayerPositionList';
import type { PlayerSquadElementList } from '../models/PlayerSquadElementList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlayerService {
    /**
     * Get Players By Team
     * @param teamId
     * @param onlyActive
     * @returns PlayerSquadElementList Successful Response
     * @throws ApiError
     */
    public static getPlayersByTeamPlayerTeamTeamIdGet(
        teamId: number,
        onlyActive: boolean = true,
    ): CancelablePromise<PlayerSquadElementList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/player/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            query: {
                'only_active': onlyActive,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Player Positions
     * @returns PlayerPositionList Successful Response
     * @throws ApiError
     */
    public static getPlayerPositionsPlayerPlayerPositionGet(): CancelablePromise<PlayerPositionList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/player/player_position',
        });
    }
    /**
     * Get Player
     * @param playerId
     * @returns Player Successful Response
     * @throws ApiError
     */
    public static getPlayerPlayerPlayerIdGet(
        playerId: number,
    ): CancelablePromise<Player> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/player/{player_id}',
            path: {
                'player_id': playerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Player
     * @param playerId
     * @param requestBody
     * @returns Player Successful Response
     * @throws ApiError
     */
    public static patchPlayerPlayerPlayerIdPatch(
        playerId: number,
        requestBody: PlayerPatch,
    ): CancelablePromise<Player> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/player/{player_id}',
            path: {
                'player_id': playerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Player
     * @param playerId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static deletePlayerPlayerPlayerIdDelete(
        playerId: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/player/{player_id}',
            path: {
                'player_id': playerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Player Card
     * @param playerId
     * @returns PlayerCard Successful Response
     * @throws ApiError
     */
    public static getPlayerCardPlayerCardPlayerIdGet(
        playerId: number,
    ): CancelablePromise<PlayerCard> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/player/card/{player_id}',
            path: {
                'player_id': playerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Player
     * @param requestBody
     * @returns Player Successful Response
     * @throws ApiError
     */
    public static createPlayerPlayerPost(
        requestBody: PlayerCreate,
    ): CancelablePromise<Player> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/player',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Claim Player
     * @param playerId
     * @returns Player Successful Response
     * @throws ApiError
     */
    public static claimPlayerPlayerClaimPlayerIdPost(
        playerId: number,
    ): CancelablePromise<Player> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/player/claim/{player_id}',
            path: {
                'player_id': playerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Un Claim Player
     * @param playerId
     * @returns Player Successful Response
     * @throws ApiError
     */
    public static unClaimPlayerPlayerUnClaimPlayerIdPost(
        playerId: number,
    ): CancelablePromise<Player> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/player/un_claim/{player_id}',
            path: {
                'player_id': playerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
