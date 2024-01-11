/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Car } from './Car';
import type { Job } from './Job';
import type { UserEssential } from './UserEssential';
export type Journey = {
    distance_km: number;
    date: string;
    reason?: string;
    id: number;
    user: UserEssential;
    car: Car;
    job?: Job;
};

