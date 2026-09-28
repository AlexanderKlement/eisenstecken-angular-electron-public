import {
  Article,
  ArticleSmall,
  Calendar,
  Client,
  Contact,
  Credential,
  DeliveryNote,
  Expense,
  InfoPage,
  IngoingInvoice,
  Job,
  Liability,
  Offer,
  OfferElement,
  OfferElementField,
  OfferElementListElement,
  OfferElementType,
  OfferField,
  OfferLibrary,
  OfferLibraryEntry,
  OfferLibraryListElement,
  OfferStatement,
  OfferTemplate,
  OfferUnit,
  OfferV2,
  OfferV2Version,
  Order,
  OrderBundle,
  OrderedArticle,
  OrderedArticleSmall,
  OrderSmall,
  OutgoingInvoice,
  Price,
  RecalculationSmall,
  Stock,
  Supplier,
  TechnicalData,
  TemplatePaint,
  TikTakEmployee,
  TikTakTimeEntryByJob,
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
  | OfferV2
  | OfferV2Version
  | OfferField
  | OfferUnit
  | OfferElementType
  | OfferElement
  | OfferElementListElement
  | Liability
  | OfferElementField
  | OfferLibraryListElement
  | OfferLibrary
  | DeliveryNote
  | OfferLibraryEntry
  | OfferTemplate
  | OfferStatement
  | OrderSmall
  | TechnicalData
  | Credential
  | Stock
  | Expense
  | Workload
  | InfoPage
  | WoodList
  | TikTakEmployee
  | TemplatePaint
  | OrderedArticleSmall
  | RecalculationSmall
  | TikTakTimeEntryByJob;

export const ALL_INVOICES = "Alle";
export const PAID_INVOICES = "Unbezahlt";
export const UNPAID_INVOICES = "Bezahlt";
export const INVOICE_TYPES = [ALL_INVOICES, PAID_INVOICES, UNPAID_INVOICES];

//I did not come up with this myself: https://stackoverflow.com/questions/65332597/typescript-is-there-a-recursive-keyof
