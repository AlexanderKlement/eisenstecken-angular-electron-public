/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Bulletin = {
    properties: {
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        url: {
            type: 'string',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        timestamp: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        name: {
            type: 'Translation',
            isRequired: true,
        },
        links: {
            type: 'array',
            contains: {
                type: 'Out',
            },
            isRequired: true,
        },
    },
} as const;
