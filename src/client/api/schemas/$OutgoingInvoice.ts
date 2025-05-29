/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OutgoingInvoice = {
    properties: {
        lock: {
            type: 'Lock',
            isRequired: true,
        },
        number: {
            type: 'string',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        payment_condition: {
            type: 'string',
            isRequired: true,
        },
        payment_date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        vat_number: {
            type: 'string',
            isRequired: true,
        },
        fiscal_code: {
            type: 'string',
            isRequired: true,
        },
        codice_destinatario: {
            type: 'string',
            isRequired: true,
        },
        pec: {
            type: 'string',
            isRequired: true,
        },
        isCompany: {
            type: 'boolean',
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
        pdf: {
            type: 'string',
        },
        payments: {
            type: 'array',
            contains: {
                type: 'Payment',
            },
            isRequired: true,
        },
        descriptive_articles: {
            type: 'array',
            contains: {
                type: 'DescriptiveArticle',
            },
            isRequired: true,
        },
        reminders: {
            type: 'array',
            contains: {
                type: 'Reminder',
            },
            isRequired: true,
        },
        vat: {
            type: 'Vat',
            isRequired: true,
        },
        job_id: {
            type: 'number',
            isRequired: true,
        },
        full_price_without_vat: {
            type: 'number',
            isRequired: true,
        },
        full_vat_amount: {
            type: 'number',
            isRequired: true,
        },
        full_price_with_vat: {
            type: 'number',
            isRequired: true,
        },
        client_name: {
            type: 'string',
            isRequired: true,
        },
        paid: {
            type: 'boolean',
            isRequired: true,
        },
        address: {
            type: 'Address',
            isRequired: true,
        },
    },
} as const;
