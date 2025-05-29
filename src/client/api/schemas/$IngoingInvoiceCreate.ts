/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $IngoingInvoiceCreate = {
    properties: {
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
        articles: {
            type: 'array',
            contains: {
                type: 'DescriptiveArticleCreate',
            },
            isRequired: true,
        },
        xml_server: {
            type: 'string',
        },
    },
} as const;
