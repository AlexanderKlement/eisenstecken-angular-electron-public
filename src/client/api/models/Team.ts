/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClubListElement } from './ClubListElement';
import type { File } from './File';
import type { JerseyModeEnum } from './JerseyModeEnum';
import type { LeagueListElement } from './LeagueListElement';
import type { Location } from './Location';
import type { Person } from './Person';
import type { Punishment } from './Punishment';
import type { Sponsor } from './Sponsor';
import type { Translation } from './Translation';
export type Team = {
    id: number;
    name: Translation;
    thumb: File;
    leagues: Array<LeagueListElement>;
    jerseyColor1: string;
    jerseyColor2: string;
    jerseyMode: JerseyModeEnum;
    club: (ClubListElement | null);
    outOfCompetition: boolean;
    leader: (Person | null);
    titles: Array<Translation>;
    sponsors: Array<Sponsor>;
    photo: (File | null);
    president: string;
    foundingYear: string;
    phone: string;
    mail: string;
    locations: Array<Location>;
    punishments: Array<Punishment>;
};

