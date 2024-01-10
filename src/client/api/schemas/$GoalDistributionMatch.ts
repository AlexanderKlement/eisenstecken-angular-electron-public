/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GoalDistributionMatch = {
    properties: {
        team1: {
            type: 'any-of',
            contains: [{
                type: 'GoalDistribution',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        team2: {
            type: 'any-of',
            contains: [{
                type: 'GoalDistribution',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
    },
} as const;
