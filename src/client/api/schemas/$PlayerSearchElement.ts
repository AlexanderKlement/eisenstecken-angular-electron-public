/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PlayerSearchElement = {
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
        mainTeam: {
            type: 'any-of',
            contains: [{
                type: 'TeamListMinimum',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
    },
} as const;
