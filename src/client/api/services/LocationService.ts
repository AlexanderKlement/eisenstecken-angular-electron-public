/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Location } from '../models/Location';
import type { LocationCreate } from '../models/LocationCreate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LocationService {
    /**
     * Create Location
     * @param requestBody
     * @returns Location Successful Response
     * @throws ApiError
     */
    public static createLocationLocationPost(
        requestBody: LocationCreate,
    ): CancelablePromise<Location> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/location',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
