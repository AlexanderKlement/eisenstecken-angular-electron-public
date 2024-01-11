/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Supplier = {
    properties: {
        type: {
            type: 'OrderableType',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        displayable_name: {
            type: 'string',
            isRequired: true,
        },
        lock: {
            type: 'Lock',
            isRequired: true,
        },
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
        address: {
            type: 'Address',
            isRequired: true,
        },
        language: {
            type: 'Language',
            isRequired: true,
        },
        favorite: {
            type: 'boolean',
            isRequired: true,
        },
        contacts: {
            type: 'array',
            contains: {
                type: 'Contact',
            },
            isRequired: true,
        },
        send_mail: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
