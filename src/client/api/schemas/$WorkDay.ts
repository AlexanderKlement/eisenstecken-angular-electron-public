/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $WorkDay = {
    properties: {
        minutes: {
            type: 'number',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
        job_sections: {
            type: 'array',
            contains: {
                type: 'JobSection',
            },
            isRequired: true,
        },
        expenses: {
            type: 'array',
            contains: {
                type: 'Expense',
            },
            isRequired: true,
        },
        drives: {
            type: 'array',
            contains: {
                type: 'Drive',
            },
            isRequired: true,
        },
        eating_place: {
            type: 'EatingPlace',
        },
        additional_workloads: {
            type: 'array',
            contains: {
                type: 'AdditionalWorkload',
            },
            isRequired: true,
        },
    },
} as const;
