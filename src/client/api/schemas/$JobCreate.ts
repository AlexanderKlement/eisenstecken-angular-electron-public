/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $JobCreate = {
    properties: {
        description: {
            type: 'string',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        client_id: {
            type: 'number',
            isRequired: true,
        },
        address: {
            type: 'AddressCreate',
            isRequired: true,
        },
        type: {
            type: 'JobTypeType',
            isRequired: true,
        },
        responsible_id: {
            type: 'number',
            isRequired: true,
        },
        year: {
            type: 'number',
            isRequired: true,
        },
        completion: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
