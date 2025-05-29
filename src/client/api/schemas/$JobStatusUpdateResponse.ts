/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $JobStatusUpdateResponse = {
    properties: {
        status: {
            type: 'JobStatusType',
            isRequired: true,
        },
        errors: {
            type: 'array',
            contains: {
                type: 'string',
            },
            isRequired: true,
        },
        success: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
