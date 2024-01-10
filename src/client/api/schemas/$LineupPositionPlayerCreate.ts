/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LineupPositionPlayerCreate = {
    properties: {
        playerId: {
            type: 'number',
            isRequired: true,
        },
        positionId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
