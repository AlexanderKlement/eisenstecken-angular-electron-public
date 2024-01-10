/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ExternalVideoCreate = {
    properties: {
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        length: {
            type: 'string',
            isRequired: true,
        },
        url: {
            type: 'string',
            isRequired: true,
        },
        name: {
            type: 'TranslationCreate',
            isRequired: true,
        },
        wvvId: {
            type: 'string',
            isRequired: true,
        },
        summary: {
            type: 'TranslationCreate',
            isRequired: true,
        },
        thumbnailId: {
            type: 'number',
            isRequired: true,
        },
        areasOfInterestIds: {
            type: 'array',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
    },
} as const;
