/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Expense } from './Expense';
import type { Lock } from './Lock';
import type { Order } from './Order';
import type { Paint } from './Paint';
import type { WoodList } from './WoodList';
import type { Workload } from './Workload';
export type Recalculation = {
    lock: Lock;
    pdf?: string;
    material_charge_percent: number;
    km: number;
    cost: number;
    id: number;
    orders: Array<Order>;
    workloads: Array<Workload>;
    expenses: Array<Expense>;
    paints: Array<Paint>;
    wood_lists: Array<WoodList>;
    total_sum: number;
};

