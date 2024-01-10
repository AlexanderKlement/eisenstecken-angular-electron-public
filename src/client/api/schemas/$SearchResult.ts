/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SearchResult = {
    properties: {
        query: {
            type: 'string',
            isRequired: true,
        },
        teams: {
            type: 'TeamListElementList',
            isRequired: true,
        },
        players: {
            type: 'PlayerSearchElementList',
            isRequired: true,
        },
        leagues: {
            type: 'LeagueList',
            isRequired: true,
        },
    },
} as const;
