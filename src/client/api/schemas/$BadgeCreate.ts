/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BadgeCreate = {
    properties: {
        badgeType: {
            type: 'BadgeTypeEnum',
            isRequired: true,
        },
        name: {
            type: 'TranslationCreate',
            isRequired: true,
        },
        description: {
            type: 'TranslationCreate',
            isRequired: true,
        },
        mediaId: {
            type: 'number',
            isRequired: true,
        },
        teamId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
