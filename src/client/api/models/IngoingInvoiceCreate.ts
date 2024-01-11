/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DescriptiveArticleCreate } from './DescriptiveArticleCreate';
export type IngoingInvoiceCreate = {
    number: string;
    name: string;
    date: string;
    payment_date: string;
    total: number;
    iva: string;
    cf: string;
    articles: Array<DescriptiveArticleCreate>;
    xml_server?: string;
};

