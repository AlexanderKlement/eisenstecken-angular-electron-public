/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FootEnum } from './FootEnum';
import type { TeamPositionCreate } from './TeamPositionCreate';
export type PlayerCreate = {
    givenName: string;
    familyName: string;
    birthdate?: (string | null);
    thumbId?: (number | null);
    jersey: number;
    foot?: (FootEnum | null);
    height?: (number | null);
    teamPositions: Array<TeamPositionCreate>;
    mainTeamId: number;
    externalId?: (string | null);
};

