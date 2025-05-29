/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderedArticleCreate = {
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
        ordered_unit_id: {
            type: 'number',
            isRequired: true,
        },
        article_id: {
            type: 'number',
            isRequired: true,
        },
        vat_id: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
