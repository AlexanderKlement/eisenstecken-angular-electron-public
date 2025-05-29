/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdditionalWorkload } from './AdditionalWorkload';
import type { Drive } from './Drive';
import type { EatingPlace } from './EatingPlace';
import type { Expense } from './Expense';
import type { JobSection } from './JobSection';
import type { UserEssential } from './UserEssential';
export type WorkDay = {
    minutes: number;
    id: number;
    date: string;
    user: UserEssential;
    job_sections: Array<JobSection>;
    expenses: Array<Expense>;
    drives: Array<Drive>;
    eating_place?: EatingPlace;
    additional_workloads: Array<AdditionalWorkload>;
};

