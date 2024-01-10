/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LeaguePatch = {
    properties: {
        matchDays: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        name: {
            type: 'any-of',
            contains: [{
                type: 'TranslationCreate',
            }, {
                type: 'null',
            }],
        },
        areaOfInterestIds: {
            type: 'any-of',
            contains: [{
                type: 'array',
                contains: {
                    type: 'number',
                },
            }, {
                type: 'null',
            }],
        },
        year: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        category: {
            type: 'any-of',
            contains: [{
                type: 'LeagueCategoryEnum',
            }, {
                type: 'null',
            }],
        },
        main: {
            type: 'any-of',
            contains: [{
                type: 'boolean',
            }, {
                type: 'null',
            }],
        },
        tableRating: {
            type: 'any-of',
            contains: [{
                type: 'LeagueRatingEnum',
            }, {
                type: 'null',
            }],
        },
        active: {
            type: 'any-of',
            contains: [{
                type: 'boolean',
            }, {
                type: 'null',
            }],
        },
        matchSectionAmount: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        matchSectionDurationMinutes: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        matchSectionPauseDurationMinutes: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
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
