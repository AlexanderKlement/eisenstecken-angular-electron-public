/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BulletinCreate = {
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
        name: {
            type: 'TranslationCreate',
            isRequired: true,
        },
        areasOfInterest: {
            type: 'array',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
        links: {
            type: 'dictionary',
            contains: {
                type: 'string',
            },
            isRequired: true,
        },
    },
} as const;
