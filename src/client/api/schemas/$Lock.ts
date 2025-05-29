/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Lock = {
    properties: {
        key: {
            type: 'string',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
        timestamp: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        locked: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
