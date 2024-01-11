/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $WorkDayCreate = {
    properties: {
        minutes: {
            type: 'number',
            isRequired: true,
        },
        job_sections: {
            type: 'array',
            contains: {
                type: 'JobSectionCreate',
            },
            isRequired: true,
        },
        expenses: {
            type: 'array',
            contains: {
                type: 'ExpenseCreate',
            },
            isRequired: true,
        },
        drives: {
            type: 'array',
            contains: {
                type: 'DriveCreate',
            },
            isRequired: true,
        },
        eating_place_id: {
            type: 'number',
            isRequired: true,
        },
        additional_workloads: {
            type: 'array',
            contains: {
                type: 'AdditionalWorkloadCreate',
            },
            isRequired: true,
        },
    },
} as const;
