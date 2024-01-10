/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LineupCreate = {
    properties: {
        lineupPositionPlayers: {
            type: 'array',
            contains: {
                type: 'LineupPositionPlayerCreate',
            },
            isRequired: true,
        },
        typeId: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
