/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Ad = {
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
            isRequired: true,
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
            isRequired: true,
        },
        priority: {
            type: 'number',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        fileMobile: {
            type: 'File',
            isRequired: true,
        },
        fileDesktop: {
            type: 'File',
            isRequired: true,
        },
        areasOfInterest: {
            type: 'array',
            contains: {
                type: 'AreaOfInterest',
            },
            isRequired: true,
        },
    },
} as const;
