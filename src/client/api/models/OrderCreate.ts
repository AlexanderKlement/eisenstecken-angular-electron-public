/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderedArticleCreate } from './OrderedArticleCreate';
export type OrderCreate = {
    description: string;
    order_from_id: number;
    order_to_id: number;
    articles?: Array<OrderedArticleCreate>;
};

