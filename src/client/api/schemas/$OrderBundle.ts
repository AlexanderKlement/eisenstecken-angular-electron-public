/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderBundle = {
    properties: {
        lock: {
            type: 'Lock',
            isRequired: true,
        },
        description: {
            type: 'string',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        order_from: {
            type: 'Orderable',
            isRequired: true,
        },
        create_date: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        delivery_date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        pdf_internal: {
            type: 'string',
        },
        pdf_external: {
            type: 'string',
        },
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
        create_date_formatted: {
            type: 'string',
            isRequired: true,
        },
        delivery_date_formatted: {
            type: 'string',
            isRequired: true,
        },
        request: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
