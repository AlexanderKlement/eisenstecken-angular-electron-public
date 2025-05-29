/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Lock } from './Lock';
import type { Payment } from './Payment';
export type IngoingInvoice = {
    lock: Lock;
    number: string;
    name: string;
    date: string;
    payment_date: string;
    total: number;
    iva: string;
    cf: string;
    id: number;
    timestamp: string;
    payments: Array<Payment>;
    paid: boolean;
    xml?: string;
    xml_server?: string;
    date_formatted: string;
};

