/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Group = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        name: {
            type: 'Translation',
            isRequired: true,
        },
        key: {
            type: 'GroupEnum',
            isRequired: true,
        },
        team: {
            type: 'TeamListElement',
            isRequired: true,
        },
        message: {
            type: 'string',
            isRequired: true,
        },
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
        blocked: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
