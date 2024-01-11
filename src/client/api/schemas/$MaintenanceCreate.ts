/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MaintenanceCreate = {
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
        user_id: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
