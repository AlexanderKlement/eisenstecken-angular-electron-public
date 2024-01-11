/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Calendar } from './Calendar';
import type { Lock } from './Lock';
import type { UserEssential } from './UserEssential';
export type CalendarEntry = {
    lock: Lock;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    id: number;
    timestamp: string;
    user: UserEssential;
    calendar: Calendar;
};

