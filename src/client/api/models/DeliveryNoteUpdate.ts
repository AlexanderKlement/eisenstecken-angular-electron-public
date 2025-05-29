/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DescriptiveArticleCreate } from './DescriptiveArticleCreate';
export type DeliveryNoteUpdate = {
    number: number;
    date: string;
    name: string;
    company_address: string;
    delivery_address: string;
    variations: string;
    weight: string;
    freight: boolean;
    free: boolean;
    assigned: boolean;
    articles: Array<DescriptiveArticleCreate>;
    job_id: number;
    delivery_note_reason_id: number;
};

