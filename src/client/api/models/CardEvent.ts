/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CardType } from './CardType';
import type { PlayerListElement } from './PlayerListElement';
export type CardEvent = {
    minute: (number | null);
    id: number;
    teamId: number;
    cardType: CardType;
    type: 'CARD';
    player: (PlayerListElement | null);
};

