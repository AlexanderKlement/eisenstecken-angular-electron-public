/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ServiceCreate = {
    properties: {
        user_id: {
            type: 'number',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        minutes: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
