/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OfferCreate = {
    properties: {
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        in_price_included: {
            type: 'string',
            isRequired: true,
        },
        validity: {
            type: 'string',
            isRequired: true,
        },
        payment: {
            type: 'string',
            isRequired: true,
        },
        delivery: {
            type: 'string',
            isRequired: true,
        },
        discount_amount: {
            type: 'number',
            isRequired: true,
        },
        discount_percentage: {
            type: 'number',
            isRequired: true,
        },
        material_description: {
            type: 'string',
            isRequired: true,
        },
        material_description_title: {
            type: 'string',
            isRequired: true,
        },
        job_id: {
            type: 'number',
            isRequired: true,
        },
        descriptive_articles: {
            type: 'array',
            contains: {
                type: 'DescriptiveArticleCreate',
            },
            isRequired: true,
        },
        vat_id: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
