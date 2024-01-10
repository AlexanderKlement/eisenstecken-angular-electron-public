/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BlogCreate = {
    properties: {
        link: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        title: {
            type: 'TranslationCreate',
            isRequired: true,
        },
        summary: {
            type: 'any-of',
            contains: [{
                type: 'TranslationCreate',
            }, {
                type: 'null',
            }],
        },
        body: {
            type: 'TranslationCreate',
            isRequired: true,
        },
        pictureId: {
            type: 'number',
            isRequired: true,
        },
        date: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'date',
            }, {
                type: 'null',
            }],
        },
        uid: {
            type: 'string',
            isRequired: true,
        },
        deleted: {
            type: 'any-of',
            contains: [{
                type: 'boolean',
            }, {
                type: 'null',
            }],
        },
        areas_of_interest: {
            type: 'array',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
        sports: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
