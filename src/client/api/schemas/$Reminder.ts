/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Reminder = {
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
        timestamp: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        pdf: {
            type: 'string',
            isRequired: true,
        },
        reminder_level: {
            type: 'ReminderLevel',
            isRequired: true,
        },
    },
} as const;
