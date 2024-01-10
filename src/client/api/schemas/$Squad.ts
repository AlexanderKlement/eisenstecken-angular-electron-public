/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Squad = {
    properties: {
        matches: {
            type: 'number',
            isRequired: true,
        },
        minutes: {
            type: 'number',
            isRequired: true,
        },
        goals: {
            type: 'number',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        player: {
            type: 'PlayerSquadElement',
            isRequired: true,
        },
        team: {
            type: 'TeamListElement',
            isRequired: true,
        },
    },
} as const;
