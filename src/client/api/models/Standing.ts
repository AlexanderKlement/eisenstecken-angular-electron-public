/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { League } from './League';
import type { MatchLocationEnum } from './MatchLocationEnum';
import type { TeamListElement } from './TeamListElement';
export type Standing = {
    placement: number;
    goalsIn: number;
    goalsOut: number;
    wins: number;
    draws: number;
    losses: number;
    points: number;
    matchDay: number;
    type: MatchLocationEnum;
    matchesToZero: number;
    matchesPlayed: number;
    overTimesPlayed: number;
    overTimesWon: number;
    overTimesLost: number;
    team: TeamListElement;
    league: League;
};

