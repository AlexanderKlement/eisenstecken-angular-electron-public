/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdPositionEnum } from './AdPositionEnum';
import type { AreaOfInterest } from './AreaOfInterest';
import type { File } from './File';
export type Ad = {
    name: string;
    position: AdPositionEnum;
    start: string;
    stop: string;
    paused: (boolean | null);
    url: string;
    color: (string | null);
    priority: number;
    id: number;
    fileMobile: File;
    fileDesktop: File;
    areasOfInterest: Array<AreaOfInterest>;
};

