/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { File } from './File';
import type { FootEnum } from './FootEnum';
export type PlayerListElement = {
    givenName: string;
    familyName: string;
    birthdate: (string | null);
    id: number;
    thumb: (File | null);
    jersey: number;
    foot: (FootEnum | null);
    height: (number | null);
};

