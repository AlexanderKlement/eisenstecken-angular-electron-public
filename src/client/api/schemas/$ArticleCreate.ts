/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ArticleCreate = {
    properties: {
        mod_number: {
            type: 'string',
            isRequired: true,
        },
        price: {
            type: 'number',
            isRequired: true,
        },
        unit_id: {
            type: 'number',
            isRequired: true,
        },
        name_de: {
            type: 'string',
            isRequired: true,
        },
        name_it: {
            type: 'string',
            isRequired: true,
        },
        description_de: {
            type: 'string',
            isRequired: true,
        },
        description_it: {
            type: 'string',
            isRequired: true,
        },
        category_ids: {
            type: 'array',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
        vat_id: {
            type: 'number',
            isRequired: true,
        },
        supplier_id: {
            type: 'number',
        },
        favorite: {
            type: 'boolean',
        },
    },
} as const;
