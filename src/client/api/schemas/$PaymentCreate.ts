/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaymentCreate = {
    properties: {
        note: {
            type: 'string',
        },
        amount: {
            type: 'number',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
    },
} as const;
