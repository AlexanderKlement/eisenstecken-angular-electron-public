/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CalendarEntry = {
    properties: {
        lock: {
            type: 'Lock',
            isRequired: true,
        },
        title: {
            type: 'string',
            isRequired: true,
        },
        description: {
            type: 'string',
            isRequired: true,
        },
        start_time: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        end_time: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        timestamp: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
        calendar: {
            type: 'Calendar',
            isRequired: true,
        },
    },
} as const;
