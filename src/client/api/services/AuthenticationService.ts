/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { UserLogin } from '../models/UserLogin';
import type { UserLoginTel } from '../models/UserLoginTel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Login With Email Password
     * @param email
     * @param password
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static loginWithEmailPasswordAuthLoginPost(
        email: string,
        password: string,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            query: {
                'email': email,
                'password': password,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Secure Login With Email Password
     * @param requestBody
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static secureLoginWithEmailPasswordAuthSecureLoginPost(
        requestBody: UserLogin,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/secure_login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Secure Login With Tel Password
     * @param requestBody
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static secureLoginWithTelPasswordAuthSecureLoginTelPost(
        requestBody: UserLoginTel,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/secure_login_tel',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Refresh
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static refreshAuthRefreshPost(): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
        });
    }
}
