import {Job, Stock, Supplier, OrderableType} from 'eisenstecken-openapi-angular-library';

export type SupportedListElements = Job | Stock | Supplier;

export interface ListItem {
  name: string;
  item: SupportedListElements;
  type: OrderableType;
  collapse: false | string;
}


export function isJob(elem: SupportedListElements): elem is Job{
  return elem.type === 'job';
}
