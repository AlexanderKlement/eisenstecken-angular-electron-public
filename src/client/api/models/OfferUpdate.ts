/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DescriptiveArticleCreate } from './DescriptiveArticleCreate';
export type OfferUpdate = {
    date: string;
    in_price_included: string;
    validity: string;
    payment: string;
    delivery: string;
    discount_amount: number;
    discount_percentage: number;
    material_description: string;
    material_description_title: string;
    descriptive_articles: Array<DescriptiveArticleCreate>;
    vat_id: number;
};

