/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LeagueListMinimum = {
    properties: {
        tableRating: {
            type: 'LeagueRatingEnum',
            isRequired: true,
        },
        matchDays: {
            type: 'number',
            isRequired: true,
        },
        main: {
            type: 'any-of',
            contains: [{
                type: 'boolean',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        category: {
            type: 'LeagueCategoryEnum',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
