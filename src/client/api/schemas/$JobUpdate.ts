/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $JobUpdate = {
    properties: {
        description: {
            type: 'string',
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
        responsible_id: {
            type: 'number',
            isRequired: true,
        },
        completion: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
