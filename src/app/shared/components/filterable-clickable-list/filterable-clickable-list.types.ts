import { Job, OrderableType, Stock, Supplier } from '../../../../client/api';

export type SupportedListElements = Job | Stock | Supplier;

export interface ListItem {
  name: string;
  item: SupportedListElements;
  type: OrderableType;
  collapse: false | string;
}

export function isJob(elem: SupportedListElements): elem is Job {
  return elem.type === 'job';
}
