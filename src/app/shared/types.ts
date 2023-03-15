import {
  Article,
  Calendar, TemplatePaint,
  Client, Contact, Credential, Fee,
  IngoingInvoice, Expense,
  Job, Journey, Meal, MealSum,
  Offer, Order, OrderBundle, OrderedArticle,
  OutgoingInvoice, Price, Recalculation, Stock, Supplier, TechnicalData,
  User, Workload, Service, Maintenance, ServiceSum, InfoPage, WoodList
} from 'eisenstecken-openapi-angular-library';


export type DataSourceClass =
  Client
  | User
  | Calendar
  | Job
  | Offer
  | Article
  | OrderBundle
  | Order
  | OrderedArticle
  | OutgoingInvoice
  | IngoingInvoice
  | Supplier
  | Contact
  | Price
  | TechnicalData
  | Credential
  | Recalculation
  | Fee
  | Meal
  | MealSum
  | Stock
  | Expense
  | Workload
  | Service
  | ServiceSum
  | Maintenance
  | InfoPage
  | WoodList
  | TemplatePaint
  | Journey;

export type RecursiveKeyOf<T, Prefix extends string = never> =
  T extends string | number | bigint | boolean
    | null | undefined | ((...args: any) => any) ? never : {
    [K in keyof T & string]: T[K] extends (infer U)[]
      ? U extends string | number | bigint | boolean
        ? [Prefix] extends [never]
          ? `${K}[${U}]` | RecursiveKeyOf<U, `${K}[${U}]`>
          : `${Prefix}.${K}[${U}]` | RecursiveKeyOf<U, `${Prefix}.${K}[${U}]`>
        : never
      : [Prefix] extends [never]
        ? K | `${K}` | RecursiveKeyOf<T[K], K>
        : `${Prefix}.${K}` | `${K}` | RecursiveKeyOf<T[K], `${Prefix}.${K}` | `${K}`>
  }[keyof T & string];

//I did not come up with this myself: https://stackoverflow.com/questions/65332597/typescript-is-there-a-recursive-keyof
