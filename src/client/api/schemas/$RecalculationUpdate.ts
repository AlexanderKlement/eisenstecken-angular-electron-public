/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RecalculationUpdate = {
    properties: {
        pdf: {
            type: 'string',
        },
        material_charge_percent: {
            type: 'number',
            isRequired: true,
        },
        km: {
            type: 'number',
            isRequired: true,
        },
        cost: {
            type: 'number',
            isRequired: true,
        },
        expenses: {
            type: 'array',
            contains: {
                type: 'ExpenseCreate',
            },
            isRequired: true,
        },
        paints: {
            type: 'array',
            contains: {
                type: 'PaintCreate',
            },
            isRequired: true,
        },
        wood_lists: {
            type: 'array',
            contains: {
                type: 'WoodListCreate',
            },
            isRequired: true,
        },
    },
} as const;
