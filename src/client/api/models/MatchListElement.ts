/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeagueListElement } from './LeagueListElement';
import type { TeamListElement } from './TeamListElement';
export type MatchListElement = {
    originalStartTime: string;
    id: number;
    team1: TeamListElement;
    team2: TeamListElement;
    goal1: number;
    goal2: number;
    alternativeStartTime: (string | null);
    matchDay: number;
    league: LeagueListElement;
    cancelled: boolean;
    endTime: string;
};

