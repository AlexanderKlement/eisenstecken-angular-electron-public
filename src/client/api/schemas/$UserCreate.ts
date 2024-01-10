/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserCreate = {
    properties: {
        languageId: {
            type: 'number',
            isRequired: true,
        },
        deviceId: {
            type: 'string',
            isRequired: true,
        },
        areaOfInterestId: {
            type: 'number',
            isRequired: true,
        },
        firebaseToken: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        deviceInfo: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
