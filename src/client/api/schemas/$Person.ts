/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Person = {
    properties: {
        givenName: {
            type: 'string',
            isRequired: true,
        },
        familyName: {
            type: 'string',
            isRequired: true,
        },
        birthdate: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'date',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        thumb: {
            type: 'any-of',
            contains: [{
                type: 'File',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
    },
} as const;
