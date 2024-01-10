/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { File } from './File';
import type { LeagueListElement } from './LeagueListElement';
import type { Translation } from './Translation';
export type TeamListMinimum = {
    id: number;
    name: Translation;
    thumb: File;
    leagues: Array<LeagueListElement>;
};

