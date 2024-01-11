/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DescriptiveArticleCreate = {
    properties: {
        name: {
            type: 'string',
            isRequired: true,
        },
        amount: {
            type: 'number',
            isRequired: true,
        },
        description: {
            type: 'string',
            isRequired: true,
        },
        single_price: {
            type: 'number',
            isRequired: true,
        },
        discount: {
            type: 'number',
            isRequired: true,
        },
        alternative: {
            type: 'boolean',
            isRequired: true,
        },
        descriptive_articles: {
            type: 'array',
            contains: {
                type: 'DescriptiveArticleCreate',
            },
        },
        vat_id: {
            type: 'number',
            isRequired: true,
        },
        unit_id: {
            type: 'number',
        },
    },
} as const;
