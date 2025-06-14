/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CompanyEvent = {
    properties: {
        title: {
            type: 'string',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        event_type: {
            type: 'CompanyEventEnum',
            isRequired: true,
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
    },
} as const;
