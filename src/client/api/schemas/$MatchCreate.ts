/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MatchCreate = {
    properties: {
        originalStartTime: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        locationId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        refereeId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        team1Id: {
            type: 'number',
            isRequired: true,
        },
        team2Id: {
            type: 'number',
            isRequired: true,
        },
        matchDay: {
            type: 'number',
            isRequired: true,
        },
        leagueId: {
            type: 'number',
            isRequired: true,
        },
        endTime: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'date-time',
            }, {
                type: 'null',
            }],
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
