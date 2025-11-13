import "zone.js";
import {
  enableProdMode,
  ErrorHandler,
  provideAppInitializer,
  LOCALE_ID,
  Injectable,
  importProvidersFrom,
} from "@angular/core";
import * as Sentry from "@sentry/angular";
import { apiConfigFactory } from "./app/app.module";
import { APP_CONFIG } from "./environments/environment";
import { LocalConfigRenderer } from "./app/LocalConfigRenderer";
import { Router, RouteReuseStrategy } from "@angular/router";
import { Configuration, ApiModule } from "./api/openapi";
import { AuthService } from "./app/shared/services/auth.service";
import { AccessGuard } from "./app/shared/services/access-guard.service";
import { ChatService } from "./app/home/chat/chat.service";
import { CurrencyPipe, DatePipe, CommonModule } from "@angular/common";
import { MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { MatPaginatorIntl, MatPaginatorModule } from "@angular/material/paginator";
import { getGermanPaginatorIntl } from "./app/shared/components/table-builder/table-builder.datasource";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpClient } from "@angular/common/http";
import { GlobalHttpInterceptorService } from "./app/global-http-inceptor.service";
import { CustomReuseStrategy } from "./app/reuse-strategy";
import {
  CalendarDateFormatter,
  CalendarNativeDateFormatter,
  DateFormatterParams,
  CalendarModule,
  DateAdapter,
} from "angular-calendar";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "./app/shared/shared.module";
import { HomeModule } from "./app/home/home.module";
import { JobModule } from "./app/job/job.module";
import { ClientModule } from "./app/client/client.module";
import { UserModule } from "./app/user/user.module";
import { SettingsModule } from "./app/settings/settings.module";
import { SupplierModule } from "./app/supplier/supplier.module";
import { OrderModule } from "./app/order/order.module";
import { LoginModule } from "./app/login/login.module";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { InvoiceModule } from "./app/invoice/invoice.module";
import { EmployeeModule } from "./app/employee/employee.module";
import { EventCalendarModule } from "./app/calendar/event-calendar.module";
import { MobileAppModule } from "./app/mobile-app/mobile-app.module";
import { RecalculationModule } from "./app/recalculation/recalculation.module";
import { AppRoutingModule } from "./app/app-routing.module";
import { FlexLayoutModule } from "ng-flex-layout";
import { DeliveryNoteModule } from "./app/delivery-note/delivery-note.module";
import { DebugModule } from "./app/debug/debug.module";
import { ServiceModule } from "./app/service/service.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { PhoneBookModule } from "./app/phone-book/phone-book.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ServiceWorkerModule } from "@angular/service-worker";
import { MatIconModule } from "@angular/material/icon";
import { AppComponent } from "./app/app.component";

console.log("APP_CONFIG.production =", APP_CONFIG.production);
console.log("APP_CONFIG.apiBasePath =", APP_CONFIG.apiBasePath);
console.log("LocalConfigRenderer API =", LocalConfigRenderer.getInstance().getApi());

@Injectable()
class CustomDateFormatter extends CalendarNativeDateFormatter {
  public dayViewHour({ date, locale }: DateFormatterParams): string {
    // change this to return a different date format
    return new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(date);
  }
}

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, "./assets/i18n/", ".json");


Sentry.init({
  dsn: "https://739b39d0b92749a485e48a80da87816e@sentry.kivi.bz.it/26",
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.5,
});

LocalConfigRenderer.getInstance();

if (APP_CONFIG.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(CommonModule, BrowserModule, CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }), FormsModule, SharedModule, HomeModule, JobModule, ClientModule, UserModule, SettingsModule, SupplierModule, OrderModule, LoginModule, MatBottomSheetModule, InvoiceModule, EmployeeModule, EventCalendarModule, MobileAppModule, RecalculationModule, ApiModule.forRoot(apiConfigFactory), AppRoutingModule, FlexLayoutModule, DeliveryNoteModule, DebugModule, ServiceModule, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }), ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatSelectModule, MatButtonModule, MatToolbarModule, MatNativeDateModule, PhoneBookModule, MatSnackBarModule, ...(APP_CONFIG.production
      ? [
        ServiceWorkerModule.register("ngsw-worker.js", {
          enabled: false,
        }),
      ]
      : []), MatIconModule),
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    provideAppInitializer(() => {
      const initializerFn = (() => () => {
      })();
      return initializerFn();
    }),
    {
      provide: Configuration,
      useFactory: (authService: AuthService) => new Configuration({
        accessToken: authService.getToken.bind(authService),
        basePath: LocalConfigRenderer.getInstance().getApi(),
      }),
      deps: [AuthService],
      multi: false,
    },
    AccessGuard,
    ChatService,
    CurrencyPipe,
    DatePipe,
    {
      provide: MAT_DATE_LOCALE,
      useValue: "de-DE",
    },
    {
      provide: LOCALE_ID,
      useValue: "de-DE", // 'de-DE' for Germany, 'fr-FR' for France ...
    },
    { provide: MatPaginatorIntl, useValue: getGermanPaginatorIntl() },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptorService,
      multi: true,
    },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
})
  .catch((err) => {
    try {
      console.error("Angular bootstrap error:", err);
      if (err && typeof err === "object") {
        console.error("Angular bootstrap error (stringified):", JSON.stringify(err));
      }
    } catch {
      // ignore stringify errors
    }
  });
