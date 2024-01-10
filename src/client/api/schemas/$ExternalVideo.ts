/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ExternalVideo = {
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
            type: 'Translation',
            isRequired: true,
        },
        wvvId: {
            type: 'string',
            isRequired: true,
        },
        summary: {
            type: 'Translation',
            isRequired: true,
        },
        thumbnail: {
            type: 'File',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        areasOfInterest: {
            type: 'array',
            contains: {
                type: 'AreaOfInterest',
            },
            isRequired: true,
        },
    },
} as const;
