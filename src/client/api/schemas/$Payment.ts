/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Payment = {
    properties: {
        note: {
            type: 'string',
        },
        amount: {
            type: 'number',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
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
