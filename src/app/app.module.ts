import "./dayjs-setup";
import { Injectable } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";

import { LocalConfigRenderer } from "./LocalConfigRenderer";
import {
  CalendarNativeDateFormatter,
  DateFormatterParams,
} from "angular-calendar";
import { Configuration, ConfigurationParameters } from "../api/openapi";

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
    return new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(date);
  }
}
