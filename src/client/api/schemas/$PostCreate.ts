/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PostCreate = {
    properties: {
        content: {
            type: 'string',
            isRequired: true,
        },
        mediaIds: {
            type: 'array',
            contains: {
                type: 'number',
            },
        },
        matchId: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
