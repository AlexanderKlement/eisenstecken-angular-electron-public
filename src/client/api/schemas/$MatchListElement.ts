/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MatchListElement = {
    properties: {
        originalStartTime: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        team1: {
            type: 'TeamListElement',
            isRequired: true,
        },
        team2: {
            type: 'TeamListElement',
            isRequired: true,
        },
        goal1: {
            type: 'number',
            isRequired: true,
        },
        goal2: {
            type: 'number',
            isRequired: true,
        },
        alternativeStartTime: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'date-time',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        matchDay: {
            type: 'number',
            isRequired: true,
        },
        league: {
            type: 'LeagueListElement',
            isRequired: true,
        },
        cancelled: {
            type: 'boolean',
            isRequired: true,
        },
        endTime: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
    },
} as const;
