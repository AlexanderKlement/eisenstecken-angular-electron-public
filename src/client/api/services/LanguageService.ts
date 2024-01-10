/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Language } from '../models/Language';
import type { LanguageList } from '../models/LanguageList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LanguageService {
    /**
     * Get Languages
     * @returns LanguageList Successful Response
     * @throws ApiError
     */
    public static getLanguagesLanguageGet(): CancelablePromise<LanguageList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/language/',
        });
    }
    /**
     * Get Language
     * @param languageId
     * @returns Language Successful Response
     * @throws ApiError
     */
    public static getLanguageLanguageLanguageIdGet(
        languageId: number,
    ): CancelablePromise<Language> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/language/{language_id}',
            path: {
                'language_id': languageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
