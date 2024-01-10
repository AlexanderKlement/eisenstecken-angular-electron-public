/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MatchLocationEnum } from './MatchLocationEnum';
import type { PlayerListElement } from './PlayerListElement';
export type ManOfTheMatchListElement = {
    ranking: number;
    player: PlayerListElement;
    team: MatchLocationEnum;
    votes: number;
    percent: number;
    playtime: number;
};

