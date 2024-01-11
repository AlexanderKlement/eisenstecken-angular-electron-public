/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderedArticle = {
    properties: {
        amount: {
            type: 'number',
            isRequired: true,
        },
        discount: {
            type: 'number',
            isRequired: true,
        },
        custom_description: {
            type: 'string',
            isRequired: true,
        },
        price: {
            type: 'number',
            isRequired: true,
        },
        comment: {
            type: 'string',
            isRequired: true,
        },
        position: {
            type: 'string',
            isRequired: true,
        },
        request: {
            type: 'boolean',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        ordered_unit: {
            type: 'Unit',
            isRequired: true,
        },
        article: {
            type: 'Article',
            isRequired: true,
        },
        vat: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
