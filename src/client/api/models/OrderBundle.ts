/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Lock } from './Lock';
import type { Orderable } from './Orderable';
import type { UserEssential } from './UserEssential';
export type OrderBundle = {
    lock: Lock;
    description: string;
    id: number;
    order_from: Orderable;
    create_date: string;
    delivery_date: string;
    pdf_internal?: string;
    pdf_external?: string;
    user: UserEssential;
    create_date_formatted: string;
    delivery_date_formatted: string;
    request: boolean;
};

