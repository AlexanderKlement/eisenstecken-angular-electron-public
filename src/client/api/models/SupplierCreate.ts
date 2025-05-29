/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressCreate } from './AddressCreate';
import type { ContactCreate } from './ContactCreate';
export type SupplierCreate = {
    mail1: string;
    mail2: string;
    tel1: string;
    tel2: string;
    contact_person: string;
    destination_code: string;
    show_in_orders: boolean;
    name: string;
    address: AddressCreate;
    language_code: string;
    contacts: Array<ContactCreate>;
};

