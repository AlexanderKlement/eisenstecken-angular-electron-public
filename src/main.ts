import "zone.js";
import {
  DEFAULT_CURRENCY_CODE,
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
  Injectable,
  LOCALE_ID,
  provideAppInitializer,
  provideZoneChangeDetection
} from "@angular/core";
import * as Sentry from "@sentry/angular";
import { apiConfigFactory } from "./app/app.module";
import { APP_CONFIG } from "./environments/environment";
import { LocalConfigRenderer } from "./app/LocalConfigRenderer";
import { provideRouter, RouteReuseStrategy } from "@angular/router";
import { ApiModule, Configuration } from "./api/openapi";
import { AccessGuard } from "./app/shared/services/access-guard.service";
import { ChatService } from "./app/home/chat/chat.service";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter
} from "@angular/material/core";
import { MatPaginatorIntl, MatPaginatorModule } from "@angular/material/paginator";
import { getGermanPaginatorIntl } from "./app/shared/components/table-builder/table-builder.datasource";
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { GlobalHttpInterceptorService } from "./app/global-http-inceptor.service";
import { CustomReuseStrategy } from "./app/reuse-strategy";
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarNativeDateFormatter,
  DateAdapter as DateAdapterCalendar,
  DateFormatterParams
} from "angular-calendar";
import { bootstrapApplication, BrowserModule } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "./app/shared/shared.module";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { FlexLayoutModule } from "ng-flex-layout";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

console.log("APP_CONFIG.production =", APP_CONFIG.production);
console.log("APP_CONFIG.apiBasePath =", APP_CONFIG.apiBasePath);
console.log("LocalConfigRenderer API =", APP_CONFIG.apiBasePath);

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
  integrations: [],
  tracesSampleRate: 0.3,
  environment: APP_CONFIG.environment,
  release: "2.3.3"
});

if (APP_CONFIG.production) {
  enableProdMode();
}

if (typeof window !== "undefined" &&
  window.location.protocol === "file:" &&
  "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    if (regs.length > 0) {
      console.log("Electron/file: context - unregistering service workers:", regs);
      return Promise.all(regs.map(r => r.unregister()));
    }
    return [];
  }).then(results => {
    if (results.length > 0) {
      console.log("SW unregister results:", results);
      // Optional: you could force a reload here if needed
      // window.location.reload();
    }
  }).catch(err => {
    console.warn("Error while unregistering service workers in Electron:", err);
  });
}

@Injectable()
export class DayFirstDateAdapter extends NativeDateAdapter {
  override parse(value: any, parseFormat?: any): Date | null {
    if (typeof value === "string") {
      const str = value.trim();
      if (!str) return null;

      const m = str.match(/^(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{2}|\d{4})$/);
      if (!m) return this.invalid();

      const day = +m[1];
      const month = +m[2];
      let year = +m[3];

      // 2-stellige Jahre (Geburtstage): 26 -> 2026, 90 -> 1990
      if (m[3].length === 2) {
        const cur = new Date().getFullYear() % 100;
        year += year > cur ? 1900 : 2000;
      }

      const d = new Date(year, month - 1, day);
      // ungültige Daten wie 31.02. abfangen
      if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
        return this.invalid();
      }
      return d;
    }
    return super.parse(value, parseFormat);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    importProvidersFrom(CommonModule, BrowserModule, CalendarModule.forRoot({
        provide: DateAdapterCalendar,
        useFactory: adapterFactory
      }), FormsModule, SharedModule, MatBottomSheetModule,
      ApiModule.forRoot(apiConfigFactory), FlexLayoutModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
        }
      }), ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatSelectModule, MatButtonModule, MatToolbarModule, MatNativeDateModule, MatSnackBarModule, MatIconModule),
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false
      })
    },
    provideRouter(routes),
    provideAppInitializer(() => {
      const initializerFn = (() => () => {
      })();
      return initializerFn();
    }),
    {
      provide: Configuration,
      useFactory: () => new Configuration({
        credentials: {
          "OAuth2PasswordBearer": () => localStorage.getItem("access_token") ?? ""
        },
        basePath: LocalConfigRenderer.getInstance().getApi()
      })
    },
    AccessGuard,
    ChatService,
    CurrencyPipe,
    DatePipe,
    {
      provide: MAT_DATE_LOCALE,
      useValue: "de-DE"
    },
    { provide: DateAdapter, useClass: DayFirstDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: "dynamic" }
    },
    {
      provide: LOCALE_ID,
      useValue: "de-DE"
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: "EUR"
    },
    { provide: MatPaginatorIntl, useValue: getGermanPaginatorIntl() },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptorService,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ]
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
