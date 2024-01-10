/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { File } from './File';
import type { FootEnum } from './FootEnum';
import type { TeamListElement } from './TeamListElement';
import type { TeamPosition } from './TeamPosition';
import type { UserEssential } from './UserEssential';
export type Player = {
    givenName: string;
    familyName: string;
    birthdate: (string | null);
    id: number;
    thumb: (File | null);
    jersey: number;
    foot: (FootEnum | null);
    height: (number | null);
    mainTeamId: (number | null);
    teams: Array<TeamListElement>;
    user: (UserEssential | null);
    teamPositions: Array<TeamPosition>;
};

