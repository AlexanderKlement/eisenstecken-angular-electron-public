/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TranslationCreate } from './TranslationCreate';
export type BulletinCreate = {
    date: string;
    url: string;
    name: TranslationCreate;
    areasOfInterest: Array<number>;
    links: Record<string, string>;
};

