/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DeliveryNoteCreate = {
    properties: {
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
        articles: {
            type: 'array',
            contains: {
                type: 'DescriptiveArticleCreate',
            },
            isRequired: true,
        },
        job_id: {
            type: 'number',
            isRequired: true,
        },
        delivery_note_reason_id: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
