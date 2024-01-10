/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ChangeEvent = {
    properties: {
        minute: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        teamId: {
            type: 'number',
            isRequired: true,
        },
        playerIn: {
            type: 'PlayerListElement',
            isRequired: true,
        },
        injured: {
            type: 'boolean',
            isRequired: true,
        },
        type: {
            type: 'string',
            isRequired: true,
        },
        player: {
            type: 'PlayerListElement',
            isRequired: true,
        },
    },
} as const;
