/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Right } from './Right';
export type User = {
    email: string;
    tel: string;
    firstname: string;
    secondname: string;
    cost: number;
    innovaphone_user: string;
    innovaphone_pass: string;
    notifications: boolean;
    id: number;
    fullname: string;
    handy: string;
    dial: string;
    disabled?: boolean;
    rights?: Array<Right>;
    employee: boolean;
    office: boolean;
    hours: boolean;
    chat: boolean;
    position: string;
};

