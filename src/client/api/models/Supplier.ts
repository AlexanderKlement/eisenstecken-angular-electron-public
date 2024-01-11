/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { Contact } from './Contact';
import type { Language } from './Language';
import type { Lock } from './Lock';
import type { OrderableType } from './OrderableType';
export type Supplier = {
    type: OrderableType;
    name: string;
    id: number;
    displayable_name: string;
    lock: Lock;
    mail1: string;
    mail2: string;
    tel1: string;
    tel2: string;
    contact_person: string;
    destination_code: string;
    show_in_orders: boolean;
    address: Address;
    language: Language;
    favorite: boolean;
    contacts: Array<Contact>;
    send_mail: boolean;
};

