/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Lock } from './Lock';
import type { OrderableType } from './OrderableType';
export type Stock = {
    type: OrderableType;
    name: string;
    id: number;
    displayable_name: string;
    lock: Lock;
};

