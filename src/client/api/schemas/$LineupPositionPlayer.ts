/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LineupPositionPlayer = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        player: {
            type: 'PlayerListElement',
            isRequired: true,
        },
        position: {
            type: 'LineupPosition',
            isRequired: true,
        },
    },
} as const;
