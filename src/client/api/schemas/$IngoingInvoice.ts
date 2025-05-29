/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $IngoingInvoice = {
    properties: {
        lock: {
            type: 'Lock',
            isRequired: true,
        },
        number: {
            type: 'string',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        payment_date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        total: {
            type: 'number',
            isRequired: true,
        },
        iva: {
            type: 'string',
            isRequired: true,
        },
        cf: {
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
        payments: {
            type: 'array',
            contains: {
                type: 'Payment',
            },
            isRequired: true,
        },
        paid: {
            type: 'boolean',
            isRequired: true,
        },
        xml: {
            type: 'string',
        },
        xml_server: {
            type: 'string',
        },
        date_formatted: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
