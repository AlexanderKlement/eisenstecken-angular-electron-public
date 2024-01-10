/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { File } from './File';
import type { UserBadge } from './UserBadge';
export type UserEssential = {
    id: number;
    username: string;
    givenName: (string | null);
    familyName: (string | null);
    email: (string | null);
    tel: (string | null);
    premium: boolean;
    emailConfirmed: boolean;
    telConfirmed: boolean;
    anonymous: boolean;
    thumb: (File | null);
    badges: Array<UserBadge>;
    playerId: (number | null);
    personId: (number | null);
};

