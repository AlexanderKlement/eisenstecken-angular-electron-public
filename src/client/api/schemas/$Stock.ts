/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Stock = {
    properties: {
        type: {
            type: 'OrderableType',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        displayable_name: {
            type: 'string',
            isRequired: true,
        },
        lock: {
            type: 'Lock',
            isRequired: true,
        },
    },
} as const;
