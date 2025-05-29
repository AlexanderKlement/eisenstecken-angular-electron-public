/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Meal = {
    properties: {
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
        eating_place: {
            type: 'EatingPlace',
            isRequired: true,
        },
    },
} as const;
