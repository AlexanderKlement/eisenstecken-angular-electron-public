/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderUpdate = {
    properties: {
        description: {
            type: 'string',
            isRequired: true,
        },
        articles: {
            type: 'array',
            contains: {
                type: 'OrderedArticleCreate',
            },
        },
    },
} as const;
