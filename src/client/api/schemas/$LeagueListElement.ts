/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LeagueListElement = {
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
        name: {
            type: 'Translation',
            isRequired: true,
        },
        year: {
            type: 'number',
            isRequired: true,
        },
        officialName: {
            type: 'string',
            isRequired: true,
        },
        hasPlayerStatistics: {
            type: 'boolean',
            isRequired: true,
        },
        hasTeamStatistics: {
            type: 'boolean',
            isRequired: true,
        },
        hasManOfTheMatch: {
            type: 'boolean',
            isRequired: true,
        },
        hasLineup: {
            type: 'boolean',
            isRequired: true,
        },
        hasFeed: {
            type: 'boolean',
            isRequired: true,
        },
        hasScorers: {
            type: 'boolean',
            isRequired: true,
        },
        hasSquad: {
            type: 'boolean',
            isRequired: true,
        },
        hasBetting: {
            type: 'boolean',
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
        active: {
            type: 'boolean',
            isRequired: true,
        },
        currentMatchDay: {
            type: 'number',
            isRequired: true,
        },
        sports: {
            type: 'SportEnum',
            isRequired: true,
        },
        amountMatchDaysHalfSeason: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
    },
} as const;
