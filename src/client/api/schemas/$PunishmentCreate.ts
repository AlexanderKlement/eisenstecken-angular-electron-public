/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PunishmentCreate = {
    properties: {
        deduction: {
            type: 'number',
            isRequired: true,
        },
        teamId: {
            type: 'number',
            isRequired: true,
        },
        matchId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        leagueId: {
            type: 'number',
            isRequired: true,
        },
        cause: {
            type: 'TranslationCreate',
            isRequired: true,
        },
    },
} as const;
