/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ServiceSum = {
    properties: {
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
        month: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        internal: {
            type: 'number',
            isRequired: true,
        },
        external: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
