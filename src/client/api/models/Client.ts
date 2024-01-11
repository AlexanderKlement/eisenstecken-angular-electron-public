/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { Contact } from './Contact';
import type { Gender } from './Gender';
import type { Language } from './Language';
import type { Lock } from './Lock';
export type Client = {
    lock: Lock;
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
    id: number;
    gender?: Gender;
    address: Address;
    language: Language;
    fullname?: string;
    contacts: Array<Contact>;
};

