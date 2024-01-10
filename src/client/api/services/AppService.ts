/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangeLogElement } from '../models/ChangeLogElement';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AppService {
    /**
     * Get App Version
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getAppVersionAppVersionGet(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/app/version',
        });
    }
    /**
     * Get Update Required
     * @param version
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static getUpdateRequiredAppUpdateRequiredVersionGet(
        version: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/app/update_required/{version}',
            path: {
                'version': version,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Agb Level
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getAgbLevelAppAgbLevelGet(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/app/agb_level',
        });
    }
    /**
     * Get Changelog
     * @param offset
     * @param limit
     * @returns ChangeLogElement Successful Response
     * @throws ApiError
     */
    public static getChangelogAppChangelogGet(
        offset?: number,
        limit: number = 50,
    ): CancelablePromise<Array<ChangeLogElement>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/app/changelog',
            query: {
                'offset': offset,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get App Version
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getAppVersionSrcVersionGet(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/src/version',
        });
    }
    /**
     * Get Update Required
     * @param version
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static getUpdateRequiredSrcUpdateRequiredVersionGet(
        version: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/src/update_required/{version}',
            path: {
                'version': version,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Agb Level
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getAgbLevelSrcAgbLevelGet(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/src/agb_level',
        });
    }
}
