/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Lock } from './Lock';
import type { Orderable } from './Orderable';
import type { OrderBundle } from './OrderBundle';
import type { OrderedArticle } from './OrderedArticle';
import type { OrderStatusType } from './OrderStatusType';
import type { UserEssential } from './UserEssential';
export type Order = {
    lock: Lock;
    description: string;
    id: number;
    order_from: Orderable;
    order_to: Orderable;
    create_date: string;
    delivery_date?: string;
    pdf?: string;
    articles: Array<OrderedArticle>;
    status: OrderStatusType;
    status_translation: string;
    order_bundle?: OrderBundle;
    user: UserEssential;
    create_date_formatted: string;
};

