/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Comment = {
    properties: {
        content: {
            type: 'string',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        comments: {
            type: 'array',
            contains: {
                type: 'Comment',
            },
            isRequired: true,
        },
        likes: {
            type: 'array',
            contains: {
                type: 'UserEssential',
            },
            isRequired: true,
        },
        created: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        author: {
            type: 'UserEssential',
            isRequired: true,
        },
    },
} as const;
