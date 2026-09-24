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
  Service,
  ServiceSum,
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
  | OfferElementField
  | OfferLibraryListElement
  | OfferLibrary
  | OfferLibraryEntry
  | OfferTemplate
  | OfferStatement
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
  | TikTakTimeEntryByJob
  | Journey;


//I did not come up with this myself: https://stackoverflow.com/questions/65332597/typescript-is-there-a-recursive-keyof
