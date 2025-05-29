/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MealSum = {
    properties: {
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        eating_place: {
            type: 'EatingPlace',
        },
        sum: {
            type: 'number',
        },
    },
} as const;
