/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MatchImportResult = {
    properties: {
        match: {
            type: 'any-of',
            contains: [{
                type: 'MatchListElement',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        fixType: {
            type: 'MatchFixEnum',
            isRequired: true,
        },
        fixMessage: {
            type: 'string',
            isRequired: true,
        },
        lineIndex: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
