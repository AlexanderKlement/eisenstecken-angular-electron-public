/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DescriptiveArticleCreate } from './descriptiveArticleCreate';


export interface IngoingInvoiceCreate { 
    number: string;
    name: string;
    date: string;
    payment_date: string;
    total: number;
    iva: string;
    cf: string;
    articles: Array<DescriptiveArticleCreate>;
    xml_server?: string;
}
