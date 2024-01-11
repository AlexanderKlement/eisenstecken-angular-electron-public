/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderBundleCreate = {
    properties: {
        description: {
            type: 'string',
            isRequired: true,
        },
        order_from_id: {
            type: 'number',
            isRequired: true,
        },
        orders: {
            type: 'array',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
        delivery_date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        request: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
