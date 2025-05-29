/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Calendar = {
    properties: {
        name: {
            type: 'string',
            isRequired: true,
        },
        open: {
            type: 'boolean',
            isRequired: true,
        },
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
    },
} as const;
