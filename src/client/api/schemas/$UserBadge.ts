/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserBadge = {
    properties: {
        team: {
            type: 'any-of',
            contains: [{
                type: 'TeamListElement',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        badge: {
            type: 'Badge',
            isRequired: true,
        },
    },
} as const;
