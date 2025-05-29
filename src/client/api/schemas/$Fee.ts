/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Fee = {
    properties: {
        reason: {
            type: 'string',
            isRequired: true,
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
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
    },
} as const;
