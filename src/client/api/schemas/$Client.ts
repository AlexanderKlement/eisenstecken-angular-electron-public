/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Client = {
    properties: {
        lock: {
            type: 'Lock',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        lastname: {
            type: 'string',
            isRequired: true,
        },
        isCompany: {
            type: 'boolean',
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
        esigibilita_iva: {
            type: 'string',
            isRequired: true,
        },
        publica_amministrazione: {
            type: 'boolean',
            isRequired: true,
        },
        cup: {
            type: 'string',
            isRequired: true,
        },
        cig: {
            type: 'string',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        gender: {
            type: 'Gender',
        },
        address: {
            type: 'Address',
            isRequired: true,
        },
        language: {
            type: 'Language',
            isRequired: true,
        },
        fullname: {
            type: 'string',
        },
        contacts: {
            type: 'array',
            contains: {
                type: 'Contact',
            },
            isRequired: true,
        },
    },
} as const;
