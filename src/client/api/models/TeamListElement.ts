/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClubListElement } from './ClubListElement';
import type { File } from './File';
import type { JerseyModeEnum } from './JerseyModeEnum';
import type { LeagueListElement } from './LeagueListElement';
import type { Translation } from './Translation';
export type TeamListElement = {
    id: number;
    name: Translation;
    thumb: File;
    leagues: Array<LeagueListElement>;
    jerseyColor1: string;
    jerseyColor2: string;
    jerseyMode: JerseyModeEnum;
    club: (ClubListElement | null);
    outOfCompetition: boolean;
};

