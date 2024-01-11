/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { DescriptiveArticle } from './DescriptiveArticle';
import type { Lock } from './Lock';
import type { Payment } from './Payment';
import type { Reminder } from './Reminder';
import type { Vat } from './Vat';
export type OutgoingInvoice = {
    lock: Lock;
    number: string;
    date: string;
    payment_condition: string;
    payment_date: string;
    name: string;
    vat_number: string;
    fiscal_code: string;
    codice_destinatario: string;
    pec: string;
    isCompany: boolean;
    id: number;
    timestamp: string;
    pdf?: string;
    payments: Array<Payment>;
    descriptive_articles: Array<DescriptiveArticle>;
    reminders: Array<Reminder>;
    vat: Vat;
    job_id: number;
    full_price_without_vat: number;
    full_vat_amount: number;
    full_price_with_vat: number;
    client_name: string;
    paid: boolean;
    address: Address;
};

