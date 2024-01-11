/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DescriptiveArticle = {
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
        id: {
            type: 'number',
            isRequired: true,
        },
        descriptive_article: {
            type: 'array',
            contains: {
                type: 'DescriptiveArticle',
            },
        },
        vat: {
            type: 'Vat',
            isRequired: true,
        },
        unit: {
            type: 'Unit',
            isRequired: true,
        },
        price_with_vat: {
            type: 'number',
        },
        price_without_vat: {
            type: 'number',
        },
        vat_amount: {
            type: 'number',
        },
        header: {
            type: 'boolean',
        },
    },
} as const;
