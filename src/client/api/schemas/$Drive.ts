/* generated using openapi-typescript-codegen -- do no edit */
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
