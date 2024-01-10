/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AdCreate = {
    properties: {
        name: {
            type: 'string',
            isRequired: true,
        },
        position: {
            type: 'AdPositionEnum',
            isRequired: true,
        },
        start: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        stop: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        paused: {
            type: 'any-of',
            contains: [{
                type: 'boolean',
            }, {
                type: 'null',
            }],
        },
        url: {
            type: 'string',
            isRequired: true,
        },
        color: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        priority: {
            type: 'number',
            isRequired: true,
        },
        fileMobileId: {
            type: 'number',
            isRequired: true,
        },
        fileDesktopId: {
            type: 'number',
            isRequired: true,
        },
        areaOfInterestIds: {
            type: 'array',
            contains: {
                type: 'number',
            },
        },
    },
} as const;
