/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Lineup = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        players: {
            type: 'array',
            contains: {
                type: 'LineupPositionPlayer',
            },
            isRequired: true,
        },
        type: {
            type: 'LineupType',
            isRequired: true,
        },
    },
} as const;
