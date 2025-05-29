/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExpenseCreate } from './ExpenseCreate';
import type { PaintCreate } from './PaintCreate';
import type { WoodListCreate } from './WoodListCreate';
export type RecalculationUpdate = {
    pdf?: string;
    material_charge_percent: number;
    km: number;
    cost: number;
    expenses: Array<ExpenseCreate>;
    paints: Array<PaintCreate>;
    wood_lists: Array<WoodListCreate>;
};

