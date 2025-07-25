/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $User = {
    properties: {
        email: {
            type: 'string',
            isRequired: true,
        },
        tel: {
            type: 'string',
            isRequired: true,
        },
        firstname: {
            type: 'string',
            isRequired: true,
        },
        secondname: {
            type: 'string',
            isRequired: true,
        },
        cost: {
            type: 'number',
            isRequired: true,
        },
        innovaphone_user: {
            type: 'string',
            isRequired: true,
        },
        innovaphone_pass: {
            type: 'string',
            isRequired: true,
        },
        notifications: {
            type: 'boolean',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        fullname: {
            type: 'string',
            isRequired: true,
        },
        handy: {
            type: 'string',
            isRequired: true,
        },
        dial: {
            type: 'string',
            isRequired: true,
        },
        disabled: {
            type: 'boolean',
        },
        rights: {
            type: 'array',
            contains: {
                type: 'Right',
            },
        },
        employee: {
            type: 'boolean',
            isRequired: true,
        },
        office: {
            type: 'boolean',
            isRequired: true,
        },
        hours: {
            type: 'boolean',
            isRequired: true,
        },
        chat: {
            type: 'boolean',
            isRequired: true,
        },
        position: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
