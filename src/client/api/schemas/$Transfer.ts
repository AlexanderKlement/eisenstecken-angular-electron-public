/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Transfer = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        player: {
            type: 'PlayerListElement',
            isRequired: true,
        },
        teamFrom: {
            type: 'TeamListElement',
            isRequired: true,
        },
        teamTo: {
            type: 'TeamListElement',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
    },
} as const;
