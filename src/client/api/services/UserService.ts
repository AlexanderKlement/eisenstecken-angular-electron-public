/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { Group } from '../models/Group';
import type { GroupRequest } from '../models/GroupRequest';
import type { PasswordChange } from '../models/PasswordChange';
import type { PasswordReset } from '../models/PasswordReset';
import type { ScopeEnum } from '../models/ScopeEnum';
import type { User } from '../models/User';
import type { UserCreate } from '../models/UserCreate';
import type { UserPatch } from '../models/UserPatch';
import type { UserRegister } from '../models/UserRegister';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Create User
     * @param requestBody
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static createUserUserPost(
        requestBody: UserCreate,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Users
     * @param limit
     * @param offset
     * @returns User Successful Response
     * @throws ApiError
     */
    public static getUsersUserGet(
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/',
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch User
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static patchUserUserPatch(
        requestBody: UserPatch,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * @returns number Successful Response
     * @throws ApiError
     */
    public static deleteUserUserDelete(): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/',
        });
    }
    /**
     * Get User Me
     * @returns User Successful Response
     * @throws ApiError
     */
    public static getUserMeUserMeGet(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/me',
        });
    }
    /**
     * Register User
     * @param requestBody
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static registerUserUserRegisterPost(
        requestBody: UserRegister,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Scope
     * @param userId
     * @param scope
     * @returns User Successful Response
     * @throws ApiError
     */
    public static addScopeUserScopeAddUserIdPost(
        userId: number,
        scope: ScopeEnum,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/scope/add/{user_id}',
            path: {
                'user_id': userId,
            },
            query: {
                'scope': scope,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Scope
     * @param userId
     * @param scope
     * @returns User Successful Response
     * @throws ApiError
     */
    public static removeScopeUserScopeRemoveUserIdPost(
        userId: number,
        scope: ScopeEnum,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/scope/remove/{user_id}',
            path: {
                'user_id': userId,
            },
            query: {
                'scope': scope,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Favorite Match
     * @param matchId
     * @returns User Successful Response
     * @throws ApiError
     */
    public static favoriteMatchUserFavoriteMatchMatchIdPut(
        matchId: number,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/favorite/match/{match_id}',
            path: {
                'match_id': matchId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Favorite Team
     * @param teamId
     * @returns User Successful Response
     * @throws ApiError
     */
    public static favoriteTeamUserFavoriteTeamTeamIdPut(
        teamId: number,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/favorite/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Favorite League
     * @param leagueId
     * @returns User Successful Response
     * @throws ApiError
     */
    public static favoriteLeagueUserFavoriteLeagueLeagueIdPut(
        leagueId: number,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/favorite/league/{league_id}',
            path: {
                'league_id': leagueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Favorite Match
     * @param matchId
     * @returns User Successful Response
     * @throws ApiError
     */
    public static favoriteMatchUserUnfavoriteMatchMatchIdPut(
        matchId: number,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/unfavorite/match/{match_id}',
            path: {
                'match_id': matchId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unfavorite Team
     * @param teamId
     * @returns User Successful Response
     * @throws ApiError
     */
    public static unfavoriteTeamUserUnfavoriteTeamTeamIdPut(
        teamId: number,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/unfavorite/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unfavorite League
     * @param leagueId
     * @returns User Successful Response
     * @throws ApiError
     */
    public static unfavoriteLeagueUserUnfavoriteLeagueLeagueIdPut(
        leagueId: number,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/unfavorite/league/{league_id}',
            path: {
                'league_id': leagueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Change Password
     * @param requestBody
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static changePasswordUserPasswordChangePost(
        requestBody: PasswordChange,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/password_change',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Forgot Password
     * @param mailOrTel
     * @returns string Successful Response
     * @throws ApiError
     */
    public static forgotPasswordUserPasswordForgotPost(
        mailOrTel: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/password_forgot',
            query: {
                'mail_or_tel': mailOrTel,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reset Password
     * @param requestBody
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static resetPasswordUserPasswordResetPost(
        requestBody: PasswordReset,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/password_reset',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch User By Id
     * @param userId
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static patchUserByIdUserUserIdPatch(
        userId: number,
        requestBody: UserPatch,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirm Mail
     * @param code
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static confirmMailUserEmailConfirmPost(
        code: string,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/email_confirm',
            query: {
                'code': code,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirm Tel
     * @param code
     * @returns AuthResponse Successful Response
     * @throws ApiError
     */
    public static confirmTelUserTelConfirmPost(
        code: string,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/tel_confirm',
            query: {
                'code': code,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Email Available
     * @param email
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static emailAvailableUserEmailAvailableEmailGet(
        email: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/email_available/{email}',
            path: {
                'email': email,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Username Available
     * @param username
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static usernameAvailableUserUsernameAvailableUsernameGet(
        username: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/username_available/{username}',
            path: {
                'username': username,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Tel Available
     * @param tel
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static telAvailableUserTelAvailableTelGet(
        tel: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/tel_available/{tel}',
            path: {
                'tel': tel,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Resend Sms
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static resendSmsUserResendSmsPost(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/resend_sms',
        });
    }
    /**
     * Create Group Request
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static createGroupRequestUserGroupRequestPost(
        requestBody: GroupRequest,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/group/request',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Group From User
     * @param userId
     * @param teamId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static removeGroupFromUserUserGroupRemoveUserUserIdTeamTeamIdPost(
        userId: number,
        teamId: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/group/remove/user/{user_id}/team/{team_id}',
            path: {
                'user_id': userId,
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upgrade User Group
     * @param userId
     * @param teamId
     * @returns Group Successful Response
     * @throws ApiError
     */
    public static upgradeUserGroupUserGroupUpgradeUserUserIdTeamTeamIdPost(
        userId: number,
        teamId: number,
    ): CancelablePromise<Group> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/group/upgrade/user/{user_id}/team/{team_id}',
            path: {
                'user_id': userId,
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Downgrade User Group
     * @param userId
     * @param teamId
     * @returns Group Successful Response
     * @throws ApiError
     */
    public static downgradeUserGroupUserGroupDowngradeUserUserIdTeamTeamIdPost(
        userId: number,
        teamId: number,
    ): CancelablePromise<Group> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/group/downgrade/user/{user_id}/team/{team_id}',
            path: {
                'user_id': userId,
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Block User Group
     * @param userId
     * @param teamId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static blockUserGroupUserGroupBlockUserUserIdTeamTeamIdPost(
        userId: number,
        teamId: number,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/group/block/user/{user_id}/team/{team_id}',
            path: {
                'user_id': userId,
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Group Requests By Team
     * @param teamId
     * @returns Group Successful Response
     * @throws ApiError
     */
    public static getGroupRequestsByTeamUserGroupTeamTeamIdGet(
        teamId: number,
    ): CancelablePromise<Array<Group>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/group/team/{team_id}',
            path: {
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
