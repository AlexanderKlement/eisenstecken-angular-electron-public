/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $File = {
    properties: {
        url: {
            type: 'string',
            isRequired: true,
        },
        mime: {
            type: 'string',
            isRequired: true,
        },
        size: {
            type: 'number',
            isRequired: true,
        },
        ext: {
            type: 'string',
            isRequired: true,
        },
        hash: {
            type: 'string',
            isRequired: true,
        },
        caption: {
            type: 'string',
            isRequired: true,
        },
        height: {
            type: 'number',
            isRequired: true,
        },
        width: {
            type: 'number',
            isRequired: true,
        },
        rotation: {
            type: 'number',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        formats: {
            type: 'array',
            contains: {
                type: 'Format',
            },
            isRequired: true,
        },
        internalPath: {
            type: 'string',
            isRequired: true,
        },
        dash: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
    },
} as const;
