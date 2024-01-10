/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Player } from '../models/Player';
import type { PlayerPositionEnum } from '../models/PlayerPositionEnum';
import type { TransferList } from '../models/TransferList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransferService {
    /**
     * Transfer Player
     * @param playerId
     * @param oldTeamId
     * @param newTeamId
     * @param position
     * @returns Player Successful Response
     * @throws ApiError
     */
    public static transferPlayerTransferPlayerIdFromOldTeamIdToNewTeamIdPost(
        playerId: number,
        oldTeamId: number,
        newTeamId: number,
        position: PlayerPositionEnum,
    ): CancelablePromise<Player> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/transfer/{player_id}/from/{old_team_id}/to/{new_team_id}',
            path: {
                'player_id': playerId,
                'old_team_id': oldTeamId,
                'new_team_id': newTeamId,
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
     * Get Transfer
     * @param areaOfInterestId
     * @param team1Id
     * @param team2Id
     * @param offset
     * @param limit
     * @returns TransferList Successful Response
     * @throws ApiError
     */
    public static getTransferTransferAreaOfInterestAreaOfInterestIdGet(
        areaOfInterestId: number,
        team1Id?: number,
        team2Id?: number,
        offset?: number,
        limit: number = 20,
    ): CancelablePromise<TransferList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transfer/area_of_interest/{area_of_interest_id}',
            path: {
                'area_of_interest_id': areaOfInterestId,
            },
            query: {
                'team_1_id': team1Id,
                'team_2_id': team2Id,
                'offset': offset,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Transfer
     * @param transferId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static deleteTransferTransferTransferIdDelete(
        transferId: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/transfer/{transfer_id}',
            path: {
                'transfer_id': transferId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
