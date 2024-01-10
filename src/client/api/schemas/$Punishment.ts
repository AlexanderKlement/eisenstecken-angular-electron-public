/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Punishment = {
    properties: {
        deduction: {
            type: 'number',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        team: {
            type: 'TeamListElement',
            isRequired: true,
        },
        match: {
            type: 'any-of',
            contains: [{
                type: 'MatchListElement',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        league: {
            type: 'LeagueListElement',
            isRequired: true,
        },
        cause: {
            type: 'Translation',
            isRequired: true,
        },
    },
} as const;
