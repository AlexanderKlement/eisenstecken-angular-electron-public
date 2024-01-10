/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PlayerCreate = {
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
        },
        height: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        teamPositions: {
            type: 'array',
            contains: {
                type: 'TeamPositionCreate',
            },
            isRequired: true,
        },
        mainTeamId: {
            type: 'number',
            isRequired: true,
        },
        externalId: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
