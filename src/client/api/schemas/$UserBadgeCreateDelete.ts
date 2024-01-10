/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserBadgeCreateDelete = {
    properties: {
        teamId: {
            type: 'any-of',
            contains: [{
                type: 'number',
            }, {
                type: 'null',
            }],
        },
        userId: {
            type: 'number',
            isRequired: true,
        },
        badgeType: {
            type: 'BadgeTypeEnum',
            isRequired: true,
        },
    },
} as const;
