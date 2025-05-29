/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdditionalWorkloadCreate } from './AdditionalWorkloadCreate';
import type { DriveCreate } from './DriveCreate';
import type { ExpenseCreate } from './ExpenseCreate';
import type { JobSectionCreate } from './JobSectionCreate';
export type WorkDayCreate = {
    minutes: number;
    job_sections: Array<JobSectionCreate>;
    expenses: Array<ExpenseCreate>;
    drives: Array<DriveCreate>;
    eating_place_id: number;
    additional_workloads: Array<AdditionalWorkloadCreate>;
};

