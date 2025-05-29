/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientCreate = {
    properties: {
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
        gender_code: {
            type: 'string',
            isRequired: true,
        },
        language_code: {
            type: 'string',
            isRequired: true,
        },
        address: {
            type: 'AddressCreate',
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
