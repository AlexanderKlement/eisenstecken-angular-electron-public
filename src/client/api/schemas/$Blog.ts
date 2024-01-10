/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Blog = {
    properties: {
        link: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        title: {
            type: 'Translation',
            isRequired: true,
        },
        body: {
            type: 'Translation',
            isRequired: true,
        },
        picture: {
            type: 'File',
            isRequired: true,
        },
        summary: {
            type: 'any-of',
            contains: [{
                type: 'Translation',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
    },
} as const;
