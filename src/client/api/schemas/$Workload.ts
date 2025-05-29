/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Workload = {
    properties: {
        minutes: {
            type: 'number',
            isRequired: true,
        },
        minutes_direction: {
            type: 'number',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
        cost: {
            type: 'number',
        },
    },
} as const;
