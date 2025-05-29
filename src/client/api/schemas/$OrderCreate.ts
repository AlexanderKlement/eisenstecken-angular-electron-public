/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderCreate = {
    properties: {
        description: {
            type: 'string',
            isRequired: true,
        },
        order_from_id: {
            type: 'number',
            isRequired: true,
        },
        order_to_id: {
            type: 'number',
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
