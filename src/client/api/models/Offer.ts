/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DescriptiveArticle } from './DescriptiveArticle';
import type { Lock } from './Lock';
import type { Vat } from './Vat';
export type Offer = {
    lock: Lock;
    date: string;
    in_price_included: string;
    validity: string;
    payment: string;
    delivery: string;
    discount_amount: number;
    discount_percentage: number;
    material_description: string;
    material_description_title: string;
    id: number;
    timestamp: string;
    descriptive_articles?: Array<DescriptiveArticle>;
    pdf?: string;
    vat: Vat;
    full_price_without_vat?: number;
    full_price_with_vat?: number;
    full_vat_amount?: number;
    date_string?: string;
    generated_number?: string;
    job_id: number;
};

