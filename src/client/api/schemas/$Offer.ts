/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Offer = {
    properties: {
        lock: {
            type: 'Lock',
            isRequired: true,
        },
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
        id: {
            type: 'number',
            isRequired: true,
        },
        timestamp: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        descriptive_articles: {
            type: 'array',
            contains: {
                type: 'DescriptiveArticle',
            },
        },
        pdf: {
            type: 'string',
        },
        vat: {
            type: 'Vat',
            isRequired: true,
        },
        full_price_without_vat: {
            type: 'number',
        },
        full_price_with_vat: {
            type: 'number',
        },
        full_vat_amount: {
            type: 'number',
        },
        date_string: {
            type: 'string',
        },
        generated_number: {
            type: 'string',
        },
        job_id: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
