/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ExternalVideoCreateRaw = {
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
            type: 'string',
            isRequired: true,
        },
        summary: {
            type: 'string',
            isRequired: true,
        },
        thumbnailUrl: {
            type: 'string',
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
