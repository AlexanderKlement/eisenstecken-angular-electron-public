/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TranslationCreate } from './TranslationCreate';
export type BlogCreate = {
    link?: (string | null);
    title: TranslationCreate;
    summary?: (TranslationCreate | null);
    body: TranslationCreate;
    pictureId: number;
    date?: (string | null);
    uid: string;
    deleted?: (boolean | null);
    areas_of_interest: Array<number>;
    sports?: (string | null);
};

