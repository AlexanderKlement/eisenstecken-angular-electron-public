/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompanyEventEnum } from './CompanyEventEnum';
import type { UserEssential } from './UserEssential';
export type CompanyEvent = {
    title: string;
    date: string;
    event_type: CompanyEventEnum;
    id: number;
    timestamp: string;
    user: UserEssential;
};

