/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SupplierCreate = {
    properties: {
        mail1: {
            type: 'string',
            isRequired: true,
        },
        mail2: {
            type: 'string',
            isRequired: true,
        },
        tel1: {
            type: 'string',
            isRequired: true,
        },
        tel2: {
            type: 'string',
            isRequired: true,
        },
        contact_person: {
            type: 'string',
            isRequired: true,
        },
        destination_code: {
            type: 'string',
            isRequired: true,
        },
        show_in_orders: {
            type: 'boolean',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        address: {
            type: 'AddressCreate',
            isRequired: true,
        },
        language_code: {
            type: 'string',
            isRequired: true,
        },
        contacts: {
            type: 'array',
            contains: {
                type: 'ContactCreate',
            },
            isRequired: true,
        },
    },
} as const;
