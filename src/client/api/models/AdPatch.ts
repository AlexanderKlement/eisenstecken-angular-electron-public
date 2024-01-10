/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdPositionEnum } from './AdPositionEnum';
export type AdPatch = {
    name?: (string | null);
    position?: (AdPositionEnum | null);
    start?: (string | null);
    stop?: (string | null);
    paused?: (boolean | null);
    url?: (string | null);
    color?: (string | null);
    fileMobileId?: (number | null);
    fileDesktopId?: (number | null);
    priority?: (number | null);
    areaOfInterestIds?: Array<number>;
};

