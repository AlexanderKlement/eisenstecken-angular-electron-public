/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdPositionEnum } from './AdPositionEnum';
export type AdCreate = {
    name: string;
    position: AdPositionEnum;
    start: string;
    stop: string;
    paused?: (boolean | null);
    url: string;
    color?: (string | null);
    priority: number;
    fileMobileId: number;
    fileDesktopId: number;
    areaOfInterestIds?: Array<number>;
};

