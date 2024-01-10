/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MatchImport = {
    properties: {
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
        startTime: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        locationName: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        goalsTeam1: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        goalsTeam2: {
            type: 'any-of',
            contains: [{
                type: 'number',
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
