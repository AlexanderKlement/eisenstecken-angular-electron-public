import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpClientModule,
} from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { Router, RouteReuseStrategy } from '@angular/router';
import { AppRouterOutletDirective } from './router-outlet';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HomeModule } from './home/home.module';
//import { APP_CONFIG } from 'environments/environment';

import { AuthService } from './shared/services/auth.service';
import { AccessGuard } from './shared/services/access-guard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChatService } from './home/chat/chat.service';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JobModule } from './job/job.module';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  registerLocaleData,
} from '@angular/common';
import { SettingsModule } from './settings/settings.module';
import { OrderModule } from './order/order.module';
import { LoginModule } from './login/login.module';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { InvoiceModule } from './invoice/invoice.module';
import { SupplierModule } from './supplier/supplier.module';
import { getGermanPaginatorIntl } from './shared/components/table-builder/table-builder.datasource';
import { RecalculationModule } from './recalculation/recalculation.module';
import { EmployeeModule } from './employee/employee.module';
import { GlobalHttpInterceptorService } from './global-http-inceptor.service';
import { DeliveryNoteModule } from './delivery-note/delivery-note.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { DebugModule } from './debug/debug.module';
import { CustomReuseStrategy } from './reuse-strategy';
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarNativeDateFormatter,
  DateAdapter,
  DateFormatterParams,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EventCalendarModule } from './calendar/event-calendar.module';
import { MobileAppModule } from './mobile-app/mobile-app.module';
import { ServiceModule } from './service/service.module';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { PhoneBookModule } from './phone-book/phone-book.module';
import * as Sentry from '@sentry/angular';
import { ErrorHandler, Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { APP_CONFIG } from '../environments/environment';
import { AppComponent } from './app.component';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

export class Configuration {
  accessToken: string;
  basePath: string;

  constructor(config: { accessToken: string; basePath: string }) {
    this.accessToken = config.accessToken;
    this.basePath = config.basePath;
  }
}

@Injectable()
class CustomDateFormatter extends CalendarNativeDateFormatter {
  public dayViewHour({ date, locale }: DateFormatterParams): string {
    // change this to return a different date format
    return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(date);
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FormsModule,
    CoreModule,
    SharedModule,
    HomeModule,
    JobModule,
    BackButtonDisableModule.forRoot(),
    ClientModule,
    UserModule,
    SettingsModule,
    SupplierModule,
    OrderModule,
    LoginModule,
    MatBottomSheetModule,
    InvoiceModule,
    EmployeeModule,
    EventCalendarModule,
    //NgxMatNativeDateModule,
    //NgxMatDatetimePickerModule,
    MobileAppModule,
    RecalculationModule,
    AppRoutingModule,
    DeliveryNoteModule,
    DebugModule,
    ServiceModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatNativeDateModule,
    PhoneBookModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: APP_CONFIG.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    MatIconModule,
    HttpClientModule,
    AppRouterOutletDirective,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: Configuration,
      deps: [AuthService],
      multi: false,
    },
    AccessGuard,
    ChatService,
    CurrencyPipe,
    DatePipe,
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'de-DE',
    },
    {
      provide: LOCALE_ID,
      useValue: 'de-DE', // 'de-DE' for Germany, 'fr-FR' for France ...
    },
    { provide: MatPaginatorIntl, useValue: getGermanPaginatorIntl() },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptorService,
      multi: true,
    },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
