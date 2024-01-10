/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { File } from './File';
import type { Translation } from './Translation';
export type Blog = {
    link: (string | null);
    title: Translation;
    body: Translation;
    picture: File;
    summary: (Translation | null);
    id: number;
    date: string;
};

