/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LeagueCreate = {
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
        },
        category: {
            type: 'LeagueCategoryEnum',
            isRequired: true,
        },
        name: {
            type: 'TranslationCreate',
            isRequired: true,
        },
        areaOfInterestIds: {
            type: 'array',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
        year: {
            type: 'number',
            isRequired: true,
        },
        sports: {
            type: 'SportEnum',
            isRequired: true,
        },
        matchSectionAmount: {
            type: 'number',
            isRequired: true,
        },
        matchSectionDurationMinutes: {
            type: 'number',
            isRequired: true,
        },
        matchSectionPauseDurationMinutes: {
            type: 'number',
            isRequired: true,
        },
        amountMatchDaysHalfSeason: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
