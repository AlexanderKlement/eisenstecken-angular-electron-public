/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AuthResponse = {
    properties: {
        access_token: {
            type: 'string',
            isRequired: true,
        },
        refresh_token: {
            type: 'string',
            isRequired: true,
        },
        user: {
            type: 'User',
            isRequired: true,
        },
        token_type: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
