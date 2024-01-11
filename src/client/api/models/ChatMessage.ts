/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserEssential } from './UserEssential';
export type ChatMessage = {
    text: string;
    id: number;
    timestamp: string;
    sender: UserEssential;
    recipient?: UserEssential;
    own: boolean;
};

