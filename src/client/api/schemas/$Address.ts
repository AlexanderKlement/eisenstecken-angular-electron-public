/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Address = {
    properties: {
        name: {
            type: 'string',
            isRequired: true,
        },
        street_number: {
            type: 'string',
            isRequired: true,
        },
        city: {
            type: 'string',
            isRequired: true,
        },
        cap: {
            type: 'string',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        country: {
            type: 'Country',
            isRequired: true,
        },
        address_1: {
            type: 'string',
            isRequired: true,
        },
        address_2: {
            type: 'string',
            isRequired: true,
        },
        country_name: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
