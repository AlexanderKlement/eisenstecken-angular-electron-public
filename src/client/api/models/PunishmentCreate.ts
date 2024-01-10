/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TranslationCreate } from './TranslationCreate';
export type PunishmentCreate = {
    deduction: number;
    teamId: number;
    matchId?: (number | null);
    leagueId: number;
    cause: TranslationCreate;
};

