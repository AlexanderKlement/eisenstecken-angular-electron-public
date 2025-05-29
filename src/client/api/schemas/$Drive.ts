/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Drive = {
    properties: {
        km: {
            type: 'number',
            isRequired: true,
        },
        reason: {
            type: 'string',
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        car: {
            type: 'Car',
            isRequired: true,
        },
        job: {
            type: 'Job',
        },
    },
} as const;
