/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LeagueMatch = {
    properties: {
        league: {
            type: 'League',
            isRequired: true,
        },
        matches: {
            type: 'array',
            contains: {
                type: 'MatchListElement',
            },
            isRequired: true,
        },
    },
} as const;
