/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupEnum } from './GroupEnum';
import type { TeamListElement } from './TeamListElement';
import type { Translation } from './Translation';
import type { UserEssential } from './UserEssential';
export type Group = {
    id: number;
    name: Translation;
    key: GroupEnum;
    team: TeamListElement;
    message: string;
    user: UserEssential;
    blocked: boolean;
};

