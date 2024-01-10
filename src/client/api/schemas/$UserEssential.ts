/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserEssential = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        username: {
            type: 'string',
            isRequired: true,
        },
        givenName: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        familyName: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        email: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        tel: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        premium: {
            type: 'boolean',
            isRequired: true,
        },
        emailConfirmed: {
            type: 'boolean',
            isRequired: true,
        },
        telConfirmed: {
            type: 'boolean',
            isRequired: true,
        },
        anonymous: {
            type: 'boolean',
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
        badges: {
            type: 'array',
            contains: {
                type: 'UserBadge',
            },
            isRequired: true,
        },
        playerId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        personId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
    },
} as const;
