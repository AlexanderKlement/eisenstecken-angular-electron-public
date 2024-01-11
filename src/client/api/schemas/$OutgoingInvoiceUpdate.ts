/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OutgoingInvoiceUpdate = {
    properties: {
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
        descriptive_articles: {
            type: 'array',
            contains: {
                type: 'DescriptiveArticleCreate',
            },
            isRequired: true,
        },
        vat_id: {
            type: 'number',
            isRequired: true,
        },
        address: {
            type: 'AddressCreate',
            isRequired: true,
        },
    },
} as const;
