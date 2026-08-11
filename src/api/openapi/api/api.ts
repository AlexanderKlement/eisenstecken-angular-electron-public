export * from "./article.service";
import { ArticleService } from "./article.service";
import { AuthService } from "./auth.service";
import { ClientService } from "./client.service";
import { DefaultService } from "./default.service";
import { HealthService } from "./health.service";
import { JobService } from "./job.service";
import { OfferV2Service } from "./offerV2.service";
import { OrderService } from "./order.service";
import { OrderBundleService } from "./orderBundle.service";
import { OrderedArticleService } from "./orderedArticle.service";
import { RecalculationService } from "./recalculation.service";
import { TikTakService } from "./tikTak.service";
import { TimeEntryService } from "./timeEntry.service";
import { VietService } from "./viet.service";

export * from "./auth.service";

export * from "./client.service";

export * from "./default.service";

export * from "./health.service";

export * from "./job.service";

export * from "./offerV2.service";

export * from "./order.service";

export * from "./orderBundle.service";

export * from "./orderedArticle.service";

export * from "./recalculation.service";

export * from "./tikTak.service";

export * from "./timeEntry.service";

export * from "./viet.service";

export const APIS = [ArticleService, AuthService, ClientService, DefaultService, HealthService, JobService, OfferV2Service, OrderService, OrderBundleService, OrderedArticleService, RecalculationService, TikTakService, TimeEntryService, VietService];
