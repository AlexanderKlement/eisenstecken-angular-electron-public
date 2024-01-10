/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Sponsor } from '../models/Sponsor';
import type { SponsorCreate } from '../models/SponsorCreate';
import type { SponsorPatch } from '../models/SponsorPatch';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SponsorService {
    /**
     * Create Sponsor
     * @param teamId
     * @param requestBody
     * @returns Sponsor Successful Response
     * @throws ApiError
     */
    public static createSponsorSponsorTeamTeamIdPost(
        teamId: number,
        requestBody: SponsorCreate,
    ): CancelablePromise<Sponsor> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sponsor/team/{team_id}',
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
     * Patch Sponsor
     * @param sponsorId
     * @param requestBody
     * @returns Sponsor Successful Response
     * @throws ApiError
     */
    public static patchSponsorSponsorSponsorIdPut(
        sponsorId: number,
        requestBody: SponsorPatch,
    ): CancelablePromise<Sponsor> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/sponsor/{sponsor_id}',
            path: {
                'sponsor_id': sponsorId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Sponsor
     * @param sponsorId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static deleteSponsorSponsorSponsorIdDelete(
        sponsorId: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/sponsor/{sponsor_id}',
            path: {
                'sponsor_id': sponsorId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
