/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BulkSearchResult = {
    properties: {
        query: {
            type: 'string',
            isRequired: true,
        },
        result: {
            type: 'any-of',
            contains: [{
                type: 'BaseBulkSearchResult',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
    },
} as const;
