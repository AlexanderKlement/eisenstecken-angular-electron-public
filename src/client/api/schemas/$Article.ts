/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Article = {
    properties: {
        lock: {
            type: 'Lock',
            isRequired: true,
        },
        mod_number: {
            type: 'string',
            isRequired: true,
        },
        price: {
            type: 'number',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        unit: {
            type: 'Unit',
            isRequired: true,
        },
        name: {
            type: 'Text',
            isRequired: true,
        },
        description: {
            type: 'Text',
            isRequired: true,
        },
        categories: {
            type: 'array',
            contains: {
                type: 'Category',
            },
            isRequired: true,
        },
        vat: {
            type: 'Vat',
            isRequired: true,
        },
        favorite: {
            type: 'boolean',
            isRequired: true,
        },
        deleted: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
