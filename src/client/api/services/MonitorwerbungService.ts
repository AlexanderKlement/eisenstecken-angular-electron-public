/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MonitorwerbungService {
    /**
     * Get By Team And Language
     * @param teamId
     * @param langSuffix
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getByTeamAndLanguageMonitorwerbungTeamIdLangSuffixGet(
        teamId: number,
        langSuffix: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/monitorwerbung/{team_id}/{lang_suffix}',
            path: {
                'team_id': teamId,
                'lang_suffix': langSuffix,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get By Team And Language And Timestamp
     * @param teamId
     * @param langSuffix
     * @param timestamp
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getByTeamAndLanguageAndTimestampMonitorwerbungTeamIdLangSuffixTimestampGet(
        teamId: number,
        langSuffix: string,
        timestamp: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/monitorwerbung/{team_id}/{lang_suffix}/{timestamp}',
            path: {
                'team_id': teamId,
                'lang_suffix': langSuffix,
                'timestamp': timestamp,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
