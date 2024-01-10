/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Player = {
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
        jersey: {
            type: 'number',
            isRequired: true,
        },
        foot: {
            type: 'any-of',
            contains: [{
                type: 'FootEnum',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        height: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        mainTeamId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        teams: {
            type: 'array',
            contains: {
                type: 'TeamListElement',
            },
            isRequired: true,
        },
        user: {
            type: 'any-of',
            contains: [{
                type: 'UserEssential',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        teamPositions: {
            type: 'array',
            contains: {
                type: 'TeamPosition',
            },
            isRequired: true,
        },
    },
} as const;
