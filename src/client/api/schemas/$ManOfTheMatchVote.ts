/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ManOfTheMatchVote = {
    properties: {
        matchId: {
            type: 'number',
            isRequired: true,
        },
        playerIds: {
            type: 'array',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
    },
} as const;
