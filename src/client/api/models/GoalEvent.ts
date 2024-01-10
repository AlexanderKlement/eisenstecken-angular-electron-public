/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoalType } from './GoalType';
import type { PlayerListElement } from './PlayerListElement';
export type GoalEvent = {
    minute: (number | null);
    id: number;
    teamId: number;
    assist: (PlayerListElement | null);
    goalType: (GoalType | null);
    type: 'GOAL';
    player: (PlayerListElement | null);
};

