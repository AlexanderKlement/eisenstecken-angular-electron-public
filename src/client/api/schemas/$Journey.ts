/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Journey = {
    properties: {
        distance_km: {
            type: 'number',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        reason: {
            type: 'string',
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        user: {
            type: 'UserEssential',
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
