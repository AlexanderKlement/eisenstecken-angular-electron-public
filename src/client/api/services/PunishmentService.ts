/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Punishment } from '../models/Punishment';
import type { PunishmentCreate } from '../models/PunishmentCreate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PunishmentService {
    /**
     * Create Punishment
     * @param requestBody
     * @returns Punishment Successful Response
     * @throws ApiError
     */
    public static createPunishmentPunishmentPost(
        requestBody: PunishmentCreate,
    ): CancelablePromise<Punishment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/punishment/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
