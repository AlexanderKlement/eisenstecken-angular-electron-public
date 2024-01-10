/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { File } from './File';
import type { MatchListElement } from './MatchListElement';
import type { UserEssential } from './UserEssential';
export type Post = {
    content: string;
    id: number;
    medias: Array<File>;
    match: MatchListElement;
    likes: Array<UserEssential>;
    author: UserEssential;
    created: string;
    deleted: boolean;
    amountComments: number;
};

