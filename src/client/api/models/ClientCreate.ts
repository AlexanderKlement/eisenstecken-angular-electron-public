/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressCreate } from './AddressCreate';
import type { ContactCreate } from './ContactCreate';
export type ClientCreate = {
    name: string;
    lastname: string;
    isCompany: boolean;
    mail1: string;
    mail2: string;
    tel1: string;
    tel2: string;
    contact_person: string;
    vat_number: string;
    fiscal_code: string;
    codice_destinatario: string;
    pec: string;
    esigibilita_iva: string;
    publica_amministrazione: boolean;
    cup: string;
    cig: string;
    gender_code: string;
    language_code: string;
    address: AddressCreate;
    contacts: Array<ContactCreate>;
};

