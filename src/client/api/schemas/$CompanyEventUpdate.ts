/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CompanyEventUpdate = {
    properties: {
        title: {
            type: 'string',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        event_type: {
            type: 'CompanyEventEnum',
            isRequired: true,
        },
    },
} as const;
