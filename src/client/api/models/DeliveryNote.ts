/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeliveryNoteReason } from './DeliveryNoteReason';
import type { DescriptiveArticle } from './DescriptiveArticle';
import type { Job } from './Job';
import type { Lock } from './Lock';
import type { UserEssential } from './UserEssential';
export type DeliveryNote = {
    lock: Lock;
    number: number;
    date: string;
    name: string;
    company_address: string;
    delivery_address: string;
    variations: string;
    weight: string;
    freight: boolean;
    free: boolean;
    assigned: boolean;
    id: number;
    user: UserEssential;
    articles: Array<DescriptiveArticle>;
    timestamp: string;
    job?: Job;
    pdf?: string;
    delivery_note_reason: DeliveryNoteReason;
};

