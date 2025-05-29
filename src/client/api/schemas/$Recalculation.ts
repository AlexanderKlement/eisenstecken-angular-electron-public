/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Recalculation = {
    properties: {
        lock: {
            type: 'Lock',
            isRequired: true,
        },
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
        id: {
            type: 'number',
            isRequired: true,
        },
        orders: {
            type: 'array',
            contains: {
                type: 'Order',
            },
            isRequired: true,
        },
        workloads: {
            type: 'array',
            contains: {
                type: 'Workload',
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
        paints: {
            type: 'array',
            contains: {
                type: 'Paint',
            },
            isRequired: true,
        },
        wood_lists: {
            type: 'array',
            contains: {
                type: 'WoodList',
            },
            isRequired: true,
        },
        total_sum: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
