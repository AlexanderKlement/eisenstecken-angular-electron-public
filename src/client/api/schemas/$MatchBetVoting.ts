/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MatchBetVoting = {
    properties: {
        team1: {
            type: 'TeamListElement',
            isRequired: true,
        },
        voting1: {
            type: 'number',
            isRequired: true,
        },
        team2: {
            type: 'TeamListElement',
            isRequired: true,
        },
        voting2: {
            type: 'number',
            isRequired: true,
        },
        'x': {
            type: 'number',
            isRequired: true,
        },
        userVoting: {
            type: 'any-of',
            contains: [{
                type: 'MatchLocationEnum',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
    },
} as const;
