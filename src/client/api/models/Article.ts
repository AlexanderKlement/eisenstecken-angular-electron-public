/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from './Category';
import type { Lock } from './Lock';
import type { Text } from './Text';
import type { Unit } from './Unit';
import type { Vat } from './Vat';
export type Article = {
    lock: Lock;
    mod_number: string;
    price: number;
    id: number;
    unit: Unit;
    name: Text;
    description: Text;
    categories: Array<Category>;
    vat: Vat;
    favorite: boolean;
    deleted: boolean;
};

