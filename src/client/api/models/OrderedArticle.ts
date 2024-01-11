/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Article } from './Article';
import type { Unit } from './Unit';
export type OrderedArticle = {
    amount: number;
    discount: number;
    custom_description: string;
    price: number;
    comment: string;
    position: string;
    request: boolean;
    id: number;
    ordered_unit: Unit;
    article: Article;
    vat: number;
};

