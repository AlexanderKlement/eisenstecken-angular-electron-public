/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { File } from './File';
import type { FootEnum } from './FootEnum';
import type { PlayerPosition } from './PlayerPosition';
export type PlayerSquadElement = {
    givenName: string;
    familyName: string;
    birthdate: (string | null);
    id: number;
    thumb: (File | null);
    jersey: number;
    foot: (FootEnum | null);
    height: (number | null);
    playerPosition: PlayerPosition;
};

