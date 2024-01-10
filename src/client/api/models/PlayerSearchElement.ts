/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { File } from './File';
import type { FootEnum } from './FootEnum';
import type { TeamListMinimum } from './TeamListMinimum';
export type PlayerSearchElement = {
    givenName: string;
    familyName: string;
    birthdate: (string | null);
    id: number;
    thumb: (File | null);
    jersey: number;
    foot: (FootEnum | null);
    height: (number | null);
    mainTeamId: (number | null);
    mainTeam: (TeamListMinimum | null);
};

