/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Order = {
    properties: {
        lock: {
            type: 'Lock',
            isRequired: true,
        },
        description: {
            type: 'string',
            isRequired: true,
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        order_from: {
            type: 'Orderable',
            isRequired: true,
        },
        order_to: {
            type: 'Orderable',
            isRequired: true,
        },
        create_date: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        delivery_date: {
            type: 'string',
            format: 'date',
        },
        pdf: {
            type: 'string',
        },
        articles: {
            type: 'array',
            contains: {
                type: 'OrderedArticle',
            },
            isRequired: true,
        },
        status: {
            type: 'OrderStatusType',
            isRequired: true,
        },
        status_translation: {
            type: 'string',
            isRequired: true,
        },
        order_bundle: {
            type: 'OrderBundle',
        },
        user: {
            type: 'UserEssential',
            isRequired: true,
        },
        create_date_formatted: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
