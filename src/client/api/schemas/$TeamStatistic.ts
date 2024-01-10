/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TeamStatistic = {
    properties: {
        value: {
            type: 'string',
            isRequired: true,
        },
        team: {
            type: 'TeamListElement',
            isRequired: true,
        },
        statistic: {
            type: 'Statistic',
            isRequired: true,
        },
        placement: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
