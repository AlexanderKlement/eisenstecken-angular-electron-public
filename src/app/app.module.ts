import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, Injectable, LOCALE_ID, NgModule, inject, provideAppInitializer } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { RouteReuseStrategy } from "@angular/router";
import { AppRouterOutletDirective } from "./router-outlet";

// NG Translate
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HomeModule } from "./home/home.module";
import { APP_CONFIG } from "environments/environment";

import { AppComponent } from "./app.component";
import { AuthService } from "./shared/services/auth.service";
import { AccessGuard } from "./shared/services/access-guard.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ChatService } from "./home/chat/chat.service";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { JobModule } from "./job/job.module";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  registerLocaleData,
} from "@angular/common";
import { SettingsModule } from "./settings/settings.module";
import { OrderModule } from "./order/order.module";
import { LoginModule } from "./login/login.module";
import { Router } from "@angular/router";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";
import * as Sentry from "@sentry/angular";
import { ClientModule } from "./client/client.module";
import { UserModule } from "./user/user.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { InvoiceModule } from "./invoice/invoice.module";
import { SupplierModule } from "./supplier/supplier.module";
import { getGermanPaginatorIntl } from "./shared/components/table-builder/table-builder.datasource";
import { RecalculationModule } from "./recalculation/recalculation.module";
import { EmployeeModule } from "./employee/employee.module";
import { GlobalHttpInterceptorService } from "./global-http-inceptor.service";
import { DeliveryNoteModule } from "./delivery-note/delivery-note.module";
import { ServiceWorkerModule } from "@angular/service-worker";
import { MatIconModule } from "@angular/material/icon";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { DebugModule } from "./debug/debug.module";
import { LocalConfigRenderer } from "./LocalConfigRenderer";
import { CustomReuseStrategy } from "./reuse-strategy";
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarNativeDateFormatter,
  DateAdapter,
  DateFormatterParams,
} from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { EventCalendarModule } from "./calendar/event-calendar.module";
import { MobileAppModule } from "./mobile-app/mobile-app.module";
import { ServiceModule } from "./service/service.module";
import { BackButtonDisableModule } from "angular-disable-browser-back-button";
import { PhoneBookModule } from "./phone-book/phone-book.module";
import { ApiModule, Configuration, ConfigurationParameters } from '../api/openapi';
import { FlexLayoutModule } from "ng-flex-layout";
// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, "./assets/i18n/", ".json");

registerLocaleData(localeDe, "de-DE", localeDeExtra);

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: LocalConfigRenderer.getInstance().getApi(),
  };
  return new Configuration(params);
}

@Injectable()
class CustomDateFormatter extends CalendarNativeDateFormatter {
  public dayViewHour({ date, locale }: DateFormatterParams): string {
    // change this to return a different date format
    return new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(date);
  }
}


