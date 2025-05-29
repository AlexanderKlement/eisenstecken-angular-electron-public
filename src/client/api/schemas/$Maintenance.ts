/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Maintenance = {
    properties: {
        minutes: {
            type: 'number',
            isRequired: true,
        },
        month: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
    },
} as const;
