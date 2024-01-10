/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ChangeEventCreate = {
    properties: {
        minute: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        teamId: {
            type: 'number',
            isRequired: true,
        },
        externalId: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        playerInId: {
            type: 'number',
            isRequired: true,
        },
        injured: {
            type: 'boolean',
            isRequired: true,
        },
        playerId: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
