/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeagueList } from './LeagueList';
import type { PlayerSearchElementList } from './PlayerSearchElementList';
import type { TeamListElementList } from './TeamListElementList';
export type SearchResult = {
    query: string;
    teams: TeamListElementList;
    players: PlayerSearchElementList;
    leagues: LeagueList;
};

