/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { Client } from './Client';
import type { JobStatus } from './JobStatus';
import type { Lock } from './Lock';
import type { OrderableType } from './OrderableType';
import type { UserEssential } from './UserEssential';
export type Job = {
    type: OrderableType;
    name: string;
    id: number;
    displayable_name: string;
    lock: Lock;
    description: string;
    timestamp: string;
    address: Address;
    year: number;
    code: string;
    client: Client;
    archive: boolean;
    path: string;
    status: JobStatus;
    sub_jobs: Array<Job>;
    is_main: boolean;
    is_sub: boolean;
    is_mini: boolean;
    responsible: UserEssential;
    main_job_id?: number;
    completion: string;
};

