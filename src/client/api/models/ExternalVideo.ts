/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AreaOfInterest } from './AreaOfInterest';
import type { File } from './File';
import type { Translation } from './Translation';
export type ExternalVideo = {
    date: string;
    length: string;
    url: string;
    name: Translation;
    wvvId: string;
    summary: Translation;
    thumbnail: File;
    id: number;
    areasOfInterest: Array<AreaOfInterest>;
};

