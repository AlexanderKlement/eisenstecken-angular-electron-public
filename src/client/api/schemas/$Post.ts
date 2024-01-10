/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Post = {
    properties: {
        content: {
            type: 'string',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        medias: {
            type: 'array',
            contains: {
                type: 'File',
            },
            isRequired: true,
        },
        match: {
            type: 'MatchListElement',
            isRequired: true,
        },
        likes: {
            type: 'array',
            contains: {
                type: 'UserEssential',
            },
            isRequired: true,
        },
        author: {
            type: 'UserEssential',
            isRequired: true,
        },
        created: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        deleted: {
            type: 'boolean',
            isRequired: true,
        },
        amountComments: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
