/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeagueCategoryEnum } from './LeagueCategoryEnum';
import type { LeagueRatingEnum } from './LeagueRatingEnum';
import type { SportEnum } from './SportEnum';
import type { Translation } from './Translation';
export type LeagueListElement = {
    tableRating: LeagueRatingEnum;
    matchDays: number;
    main: (boolean | null);
    category: LeagueCategoryEnum;
    id: number;
    name: Translation;
    year: number;
    officialName: string;
    hasPlayerStatistics: boolean;
    hasTeamStatistics: boolean;
    hasManOfTheMatch: boolean;
    hasLineup: boolean;
    hasFeed: boolean;
    hasScorers: boolean;
    hasSquad: boolean;
    hasBetting: boolean;
    matchSectionAmount: number;
    matchSectionDurationMinutes: number;
    matchSectionPauseDurationMinutes: number;
    active: boolean;
    currentMatchDay: number;
    sports: SportEnum;
    amountMatchDaysHalfSeason: (number | null);
};

