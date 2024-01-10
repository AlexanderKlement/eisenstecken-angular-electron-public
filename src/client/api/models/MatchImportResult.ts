/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MatchFixEnum } from './MatchFixEnum';
import type { MatchListElement } from './MatchListElement';
export type MatchImportResult = {
    match: (MatchListElement | null);
    fixType: MatchFixEnum;
    fixMessage: string;
    lineIndex: number;
};

