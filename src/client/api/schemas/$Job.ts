/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Job = {
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
        description: {
            type: 'string',
            isRequired: true,
        },
        timestamp: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        address: {
            type: 'Address',
            isRequired: true,
        },
        year: {
            type: 'number',
            isRequired: true,
        },
        code: {
            type: 'string',
            isRequired: true,
        },
        client: {
            type: 'Client',
            isRequired: true,
        },
        archive: {
            type: 'boolean',
            isRequired: true,
        },
        path: {
            type: 'string',
            isRequired: true,
        },
        status: {
            type: 'JobStatus',
            isRequired: true,
        },
        sub_jobs: {
            type: 'array',
            contains: {
                type: 'Job',
            },
            isRequired: true,
        },
        is_main: {
            type: 'boolean',
            isRequired: true,
        },
        is_sub: {
            type: 'boolean',
            isRequired: true,
        },
        is_mini: {
            type: 'boolean',
            isRequired: true,
        },
        responsible: {
            type: 'UserEssential',
            isRequired: true,
        },
        main_job_id: {
            type: 'number',
        },
        completion: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
