import { Job, OrderableType, Stock, Supplier } from "../../../../api/openapi";


export type SupportedListElements = Job | Stock | Supplier;

export interface ListItem {
  name: string;
  searchText: string;
  item: SupportedListElements;
  type: OrderableType;
  collapse: false | string;
  indented: boolean;
  highlighted: boolean;
}


export function isJob(elem: SupportedListElements): elem is Job{
  return elem.type === "job";
}
