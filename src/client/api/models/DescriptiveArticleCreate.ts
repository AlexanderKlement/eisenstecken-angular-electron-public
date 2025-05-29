/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DescriptiveArticleCreate = {
    name: string;
    amount: number;
    description: string;
    single_price: number;
    discount: number;
    alternative: boolean;
    descriptive_articles?: Array<DescriptiveArticleCreate>;
    vat_id: number;
    unit_id?: number;
};

