import "./dayjs-setup";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
  registerLocaleData,
} from "@angular/common";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";

import { LocalConfigRenderer } from "./LocalConfigRenderer";
import {
  CalendarNativeDateFormatter,
  DateFormatterParams,
} from "angular-calendar";
import { Configuration, ConfigurationParameters } from "../api/openapi";

const httpLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http, "./assets/i18n/", ".json");

// In providers/imports
TranslateModule.forRoot({
  loader: { provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpClient] },
});

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


