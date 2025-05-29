/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Unit } from './Unit';
import type { Vat } from './Vat';
export type DescriptiveArticle = {
    name: string;
    amount: number;
    description: string;
    single_price: number;
    discount: number;
    alternative: boolean;
    id: number;
    descriptive_article?: Array<DescriptiveArticle>;
    vat: Vat;
    unit: Unit;
    price_with_vat?: number;
    price_without_vat?: number;
    vat_amount?: number;
    header?: boolean;
};

