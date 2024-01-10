/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Standing = {
    properties: {
        placement: {
            type: 'number',
            isRequired: true,
        },
        goalsIn: {
            type: 'number',
            isRequired: true,
        },
        goalsOut: {
            type: 'number',
            isRequired: true,
        },
        wins: {
            type: 'number',
            isRequired: true,
        },
        draws: {
            type: 'number',
            isRequired: true,
        },
        losses: {
            type: 'number',
            isRequired: true,
        },
        points: {
            type: 'number',
            isRequired: true,
        },
        matchDay: {
            type: 'number',
            isRequired: true,
        },
        type: {
            type: 'MatchLocationEnum',
            isRequired: true,
        },
        matchesToZero: {
            type: 'number',
            isRequired: true,
        },
        matchesPlayed: {
            type: 'number',
            isRequired: true,
        },
        overTimesPlayed: {
            type: 'number',
            isRequired: true,
        },
        overTimesWon: {
            type: 'number',
            isRequired: true,
        },
        overTimesLost: {
            type: 'number',
            isRequired: true,
        },
        team: {
            type: 'TeamListElement',
            isRequired: true,
        },
        league: {
            type: 'League',
            isRequired: true,
        },
    },
} as const;
