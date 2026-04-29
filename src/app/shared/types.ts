import {
  Article,
  ArticleSmall,
  Calendar,
  Client,
  Contact,
  Credential,
  Expense,
  Fee,
  InfoPage,
  IngoingInvoice,
  Job,
  Journey,
  Maintenance,
  Meal,
  MealSum,
  Offer,
  Order,
  OrderBundle,
  OrderedArticle,
  OrderedArticleSmall,
  OrderSmall,
  OutgoingInvoice,
  Price,
  RecalculationSmall,
  Service,
  ServiceSum,
  Stock,
  Supplier,
  TechnicalData,
  TemplatePaint,
  TikTakEmployee,
  User,
  UserContact,
  WoodList,
  Workload
} from "../../api/openapi";


export type DataSourceClass =
  Client
  | User
  | Calendar
  | Job
  | Offer
  | Article
  | ArticleSmall
  | OrderBundle
  | Order
  | OrderedArticle
  | UserContact
  | OutgoingInvoice
  | IngoingInvoice
  | Supplier
  | Contact
  | Price
  | OrderSmall
  | TechnicalData
  | Credential
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
  | TikTakEmployee
  | TemplatePaint
  | OrderedArticleSmall
  | RecalculationSmall
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
