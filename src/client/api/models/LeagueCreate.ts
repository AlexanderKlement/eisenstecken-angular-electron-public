/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeagueCategoryEnum } from './LeagueCategoryEnum';
import type { LeagueRatingEnum } from './LeagueRatingEnum';
import type { SportEnum } from './SportEnum';
import type { TranslationCreate } from './TranslationCreate';
export type LeagueCreate = {
    tableRating: LeagueRatingEnum;
    matchDays: number;
    main?: (boolean | null);
    category: LeagueCategoryEnum;
    name: TranslationCreate;
    areaOfInterestIds: Array<number>;
    year: number;
    sports: SportEnum;
    matchSectionAmount: number;
    matchSectionDurationMinutes: number;
    matchSectionPauseDurationMinutes: number;
    amountMatchDaysHalfSeason?: (number | null);
};

