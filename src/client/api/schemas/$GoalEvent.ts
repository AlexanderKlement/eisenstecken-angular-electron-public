/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GoalEvent = {
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
        assist: {
            type: 'any-of',
            contains: [{
                type: 'PlayerListElement',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        goalType: {
            type: 'any-of',
            contains: [{
                type: 'GoalType',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        type: {
            type: 'string',
            isRequired: true,
        },
        player: {
            type: 'any-of',
            contains: [{
                type: 'PlayerListElement',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
    },
} as const;
