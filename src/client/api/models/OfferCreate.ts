/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DescriptiveArticleCreate } from './DescriptiveArticleCreate';
export type OfferCreate = {
    date: string;
    in_price_included: string;
    validity: string;
    payment: string;
    delivery: string;
    discount_amount: number;
    discount_percentage: number;
    material_description: string;
    material_description_title: string;
    job_id: number;
    descriptive_articles: Array<DescriptiveArticleCreate>;
    vat_id: number;
};

