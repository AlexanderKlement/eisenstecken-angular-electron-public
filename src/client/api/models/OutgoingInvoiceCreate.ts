/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressCreate } from './AddressCreate';
import type { DescriptiveArticleCreate } from './DescriptiveArticleCreate';
export type OutgoingInvoiceCreate = {
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
    descriptive_articles: Array<DescriptiveArticleCreate>;
    vat_id: number;
    job_id: number;
    address: AddressCreate;
};

