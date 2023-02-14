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


export interface OfferUpdate { 
    date: string;
    in_price_included: string;
    validity: string;
    payment: string;
    delivery: string;
    discount_amount: number;
    material_description: string;
    descriptive_articles: Array<DescriptiveArticleCreate>;
    vat_id: number;
}

