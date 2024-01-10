/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ManOfTheMatchListElement = {
    properties: {
        ranking: {
            type: 'number',
            isRequired: true,
        },
        player: {
            type: 'PlayerListElement',
            isRequired: true,
        },
        team: {
            type: 'MatchLocationEnum',
            isRequired: true,
        },
        votes: {
            type: 'number',
            isRequired: true,
        },
        percent: {
            type: 'number',
            isRequired: true,
        },
        playtime: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
