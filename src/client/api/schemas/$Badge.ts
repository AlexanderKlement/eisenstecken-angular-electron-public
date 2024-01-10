/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Badge = {
    properties: {
        badgeType: {
            type: 'BadgeTypeEnum',
            isRequired: true,
        },
        name: {
            type: 'Translation',
            isRequired: true,
        },
        description: {
            type: 'Translation',
            isRequired: true,
        },
        media: {
            type: 'File',
            isRequired: true,
        },
        team: {
            type: 'any-of',
            contains: [{
                type: 'TeamListElement',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
    },
} as const;
