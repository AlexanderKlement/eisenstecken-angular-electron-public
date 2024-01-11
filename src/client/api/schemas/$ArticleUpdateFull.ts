/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ArticleUpdateFull = {
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
        vat_id: {
            type: 'number',
            isRequired: true,
        },
        favorite: {
            type: 'boolean',
        },
        category_ids: {
            type: 'array',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
    },
} as const;
