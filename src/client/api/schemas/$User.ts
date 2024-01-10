/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $User = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        username: {
            type: 'string',
            isRequired: true,
        },
        givenName: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        familyName: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        email: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        tel: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        premium: {
            type: 'boolean',
            isRequired: true,
        },
        emailConfirmed: {
            type: 'boolean',
            isRequired: true,
        },
        telConfirmed: {
            type: 'boolean',
            isRequired: true,
        },
        anonymous: {
            type: 'boolean',
            isRequired: true,
        },
        thumb: {
            type: 'any-of',
            contains: [{
                type: 'File',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        badges: {
            type: 'array',
            contains: {
                type: 'UserBadge',
            },
            isRequired: true,
        },
        playerId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        personId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        language: {
            type: 'Language',
            isRequired: true,
        },
        groups: {
            type: 'array',
            contains: {
                type: 'Group',
            },
            isRequired: true,
        },
        scopes: {
            type: 'array',
            contains: {
                type: 'Scope',
            },
            isRequired: true,
        },
        areaOfInterest: {
            type: 'AreaOfInterest',
            isRequired: true,
        },
        favoriteMatches: {
            type: 'array',
            contains: {
                type: 'MatchListMinimum',
            },
            isRequired: true,
        },
        favoriteTeams: {
            type: 'array',
            contains: {
                type: 'TeamListMinimum',
            },
            isRequired: true,
        },
        favoriteLeagues: {
            type: 'array',
            contains: {
                type: 'LeagueListMinimum',
            },
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
        person: {
            type: 'any-of',
            contains: [{
                type: 'PersonListElement',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        agbLevel: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        newsletter: {
            type: 'boolean',
            isRequired: true,
        },
        blocked: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
