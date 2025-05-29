/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ChatMessage = {
    properties: {
        text: {
            type: 'string',
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
        sender: {
            type: 'UserEssential',
            isRequired: true,
        },
        recipient: {
            type: 'UserEssential',
        },
        own: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
