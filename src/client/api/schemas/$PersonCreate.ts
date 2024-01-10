/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PersonCreate = {
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
        },
        thumbId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
