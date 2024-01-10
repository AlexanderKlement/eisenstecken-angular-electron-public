/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CardEventCreate } from '../models/CardEventCreate';
import type { CardEventPatch } from '../models/CardEventPatch';
import type { CardTypeList } from '../models/CardTypeList';
import type { ChanceEventCreate } from '../models/ChanceEventCreate';
import type { ChanceEventPatch } from '../models/ChanceEventPatch';
import type { ChanceTypeList } from '../models/ChanceTypeList';
import type { ChangeEventCreate } from '../models/ChangeEventCreate';
import type { ChangeEventPatch } from '../models/ChangeEventPatch';
import type { EventType } from '../models/EventType';
import type { EventTypeEnum } from '../models/EventTypeEnum';
import type { EventTypeList } from '../models/EventTypeList';
import type { GoalEventCreate } from '../models/GoalEventCreate';
import type { GoalEventPatch } from '../models/GoalEventPatch';
import type { GoalTypeList } from '../models/GoalTypeList';
import type { SportEnum } from '../models/SportEnum';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventService {
    /**
     * Get Event
     * @param eventId
     * @returns EventType Successful Response
     * @throws ApiError
     */
    public static getEventEventEventIdGet(
        eventId: number,
    ): CancelablePromise<EventType> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/{event_id}',
            path: {
                'event_id': eventId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Event
     * @param eventId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static deleteEventEventEventIdDelete(
        eventId: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/event/{event_id}',
            path: {
                'event_id': eventId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Events
     * @param matchId
     * @returns EventTypeList Successful Response
     * @throws ApiError
     */
    public static getEventsEventGet(
        matchId: number,
    ): CancelablePromise<EventTypeList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/',
            query: {
                'match_id': matchId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Goal Event
     * @param matchId
     * @param requestBody
     * @param ignoreChecks
     * @returns EventType Successful Response
     * @throws ApiError
     */
    public static addGoalEventEventGoalMatchIdPost(
        matchId: number,
        requestBody: GoalEventCreate,
        ignoreChecks: boolean = false,
    ): CancelablePromise<EventType> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event/goal/{match_id}',
            path: {
                'match_id': matchId,
            },
            query: {
                'ignore_checks': ignoreChecks,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Change Event
     * @param matchId
     * @param requestBody
     * @returns EventType Successful Response
     * @throws ApiError
     */
    public static addChangeEventEventChangeMatchIdPost(
        matchId: number,
        requestBody: ChangeEventCreate,
    ): CancelablePromise<EventType> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event/change/{match_id}',
            path: {
                'match_id': matchId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Chance Event
     * @param matchId
     * @param requestBody
     * @returns EventType Successful Response
     * @throws ApiError
     */
    public static addChanceEventEventChanceMatchIdPost(
        matchId: number,
        requestBody: ChanceEventCreate,
    ): CancelablePromise<EventType> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event/chance/{match_id}',
            path: {
                'match_id': matchId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Card Event
     * @param matchId
     * @param requestBody
     * @returns EventType Successful Response
     * @throws ApiError
     */
    public static addCardEventEventCardMatchIdPost(
        matchId: number,
        requestBody: CardEventCreate,
    ): CancelablePromise<EventType> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event/card/{match_id}',
            path: {
                'match_id': matchId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Goal Event
     * @param eventId
     * @param requestBody
     * @returns EventType Successful Response
     * @throws ApiError
     */
    public static patchGoalEventEventGoalEventIdPatch(
        eventId: number,
        requestBody: GoalEventPatch,
    ): CancelablePromise<EventType> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/event/goal/{event_id}',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Chance Event
     * @param eventId
     * @param requestBody
     * @returns EventType Successful Response
     * @throws ApiError
     */
    public static patchChanceEventEventChanceEventIdPatch(
        eventId: number,
        requestBody: ChanceEventPatch,
    ): CancelablePromise<EventType> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/event/chance/{event_id}',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Change Event
     * @param eventId
     * @param requestBody
     * @returns EventType Successful Response
     * @throws ApiError
     */
    public static patchChangeEventEventChangeEventIdPatch(
        eventId: number,
        requestBody: ChangeEventPatch,
    ): CancelablePromise<EventType> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/event/change/{event_id}',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Card Event
     * @param eventId
     * @param requestBody
     * @returns EventType Successful Response
     * @throws ApiError
     */
    public static patchCardEventEventCardEventIdPatch(
        eventId: number,
        requestBody: CardEventPatch,
    ): CancelablePromise<EventType> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/event/card/{event_id}',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Goal Types
     * @param sports
     * @returns GoalTypeList Successful Response
     * @throws ApiError
     */
    public static getGoalTypesEventTypeGoalGet(
        sports?: SportEnum,
    ): CancelablePromise<GoalTypeList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/type/goal',
            query: {
                'sports': sports,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Card Types
     * @param sports
     * @returns CardTypeList Successful Response
     * @throws ApiError
     */
    public static getCardTypesEventTypeCardGet(
        sports?: SportEnum,
    ): CancelablePromise<CardTypeList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/type/card',
            query: {
                'sports': sports,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Chance Types
     * @param sports
     * @returns ChanceTypeList Successful Response
     * @throws ApiError
     */
    public static getChanceTypesEventTypeChanceGet(
        sports?: SportEnum,
    ): CancelablePromise<ChanceTypeList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/type/chance',
            query: {
                'sports': sports,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Event Type Enum
     * @returns EventTypeEnum Successful Response
     * @throws ApiError
     */
    public static getEventTypeEnumEventTypesGet(): CancelablePromise<EventTypeEnum> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/types',
        });
    }
}
