/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DeliveryNote = {
    properties: {
        lock: {
            type: 'Lock',
            isRequired: true,
        },
        number: {
            type: 'number',
            isRequired: true,
        },
        date: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        company_address: {
            type: 'string',
            isRequired: true,
        },
        delivery_address: {
            type: 'string',
            isRequired: true,
        },
        variations: {
            type: 'string',
            isRequired: true,
        },
        weight: {
            type: 'string',
            isRequired: true,
        },
        freight: {
            type: 'boolean',
            isRequired: true,
        },
        free: {
            type: 'boolean',
            isRequired: true,
        },
        assigned: {
            type: 'boolean',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
        articles: {
            type: 'array',
            contains: {
                type: 'DescriptiveArticle',
            },
            isRequired: true,
        },
        timestamp: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        job: {
            type: 'Job',
        },
        pdf: {
            type: 'string',
        },
        delivery_note_reason: {
            type: 'DeliveryNoteReason',
            isRequired: true,
        },
    },
} as const;
