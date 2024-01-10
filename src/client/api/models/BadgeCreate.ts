/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BadgeTypeEnum } from './BadgeTypeEnum';
import type { TranslationCreate } from './TranslationCreate';
export type BadgeCreate = {
    badgeType: BadgeTypeEnum;
    name: TranslationCreate;
    description: TranslationCreate;
    mediaId: number;
    teamId?: (number | null);
};

