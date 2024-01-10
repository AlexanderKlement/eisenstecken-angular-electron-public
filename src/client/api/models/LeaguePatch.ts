/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeagueCategoryEnum } from './LeagueCategoryEnum';
import type { LeagueRatingEnum } from './LeagueRatingEnum';
import type { TranslationCreate } from './TranslationCreate';
export type LeaguePatch = {
    matchDays?: (number | null);
    name?: (TranslationCreate | null);
    areaOfInterestIds?: (Array<number> | null);
    year?: (number | null);
    category?: (LeagueCategoryEnum | null);
    main?: (boolean | null);
    tableRating?: (LeagueRatingEnum | null);
    active?: (boolean | null);
    matchSectionAmount?: (number | null);
    matchSectionDurationMinutes?: (number | null);
    matchSectionPauseDurationMinutes?: (number | null);
    amountMatchDaysHalfSeason?: (number | null);
};

