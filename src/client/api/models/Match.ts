/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventType } from './EventType';
import type { LeagueListElement } from './LeagueListElement';
import type { Lineup } from './Lineup';
import type { Location } from './Location';
import type { Person } from './Person';
import type { Punishment } from './Punishment';
import type { TeamListElement } from './TeamListElement';
export type Match = {
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
    location: (Location | null);
    referee: (Person | null);
    lineupTeam1: (Lineup | null);
    lineupTeam2: (Lineup | null);
    events: Array<EventType>;
    punishments: Array<Punishment>;
    report: (string | null);
};

