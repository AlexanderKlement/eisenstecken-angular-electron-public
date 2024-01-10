/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Badge } from '../models/Badge';
import type { BadgeCreate } from '../models/BadgeCreate';
import type { BadgeList } from '../models/BadgeList';
import type { BadgePatch } from '../models/BadgePatch';
import type { BadgeTypeEnum } from '../models/BadgeTypeEnum';
import type { User } from '../models/User';
import type { UserBadgeCreateDelete } from '../models/UserBadgeCreateDelete';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BadgeService {
    /**
     * Get Badge
     * @param badgeType
     * @returns Badge Successful Response
     * @throws ApiError
     */
    public static getBadgeBadgeBadgeTypeGet(
        badgeType: BadgeTypeEnum,
    ): CancelablePromise<Badge> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/badge/{badge_type}',
            path: {
                'badge_type': badgeType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Badges
     * @param badgeType
     * @param requestBody
     * @returns Badge Successful Response
     * @throws ApiError
     */
    public static patchBadgesBadgeBadgeTypePatch(
        badgeType: BadgeTypeEnum,
        requestBody: BadgePatch,
    ): CancelablePromise<Badge> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/badge/{badge_type}',
            path: {
                'badge_type': badgeType,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Badges
     * @returns BadgeList Successful Response
     * @throws ApiError
     */
    public static getBadgesBadgeGet(): CancelablePromise<BadgeList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/badge/',
        });
    }
    /**
     * Create Badges
     * @param requestBody
     * @returns Badge Successful Response
     * @throws ApiError
     */
    public static createBadgesBadgePost(
        requestBody: BadgeCreate,
    ): CancelablePromise<Badge> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/badge/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Give User Badge
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static giveUserBadgeBadgeGivePut(
        requestBody: UserBadgeCreateDelete,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/badge/give',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove User Badge
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static removeUserBadgeBadgeRemoveDelete(
        requestBody: UserBadgeCreateDelete,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/badge/remove',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
