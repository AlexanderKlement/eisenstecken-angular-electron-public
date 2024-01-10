/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MatchLocationEnum } from './MatchLocationEnum';
import type { TeamListElement } from './TeamListElement';
export type MatchBetVoting = {
    team1: TeamListElement;
    voting1: number;
    team2: TeamListElement;
    voting2: number;
    'x': number;
    userVoting: (MatchLocationEnum | null);
};

