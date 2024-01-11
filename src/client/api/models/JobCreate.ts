/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressCreate } from './AddressCreate';
import type { JobTypeType } from './JobTypeType';
export type JobCreate = {
    description: string;
    name: string;
    client_id: number;
    address: AddressCreate;
    type: JobTypeType;
    responsible_id: number;
    year: number;
    completion: string;
};

