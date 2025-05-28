import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as moment from 'moment';
import { AppModule } from './app/app.module';
import { APP_CONFIG } from './environments/environment';
import { OpenAPI } from './client/api';
import * as Sentry from '@sentry/angular';

Sentry.init({
  dsn: 'https://739b39d0b92749a485e48a80da87816e@sentry.kivi.bz.it/26',
  integrations: [],
  tracesSampleRate: 1.0, // adjust in prod
});

moment.locale('de');

if (APP_CONFIG.production) {
  enableProdMode();
}

OpenAPI.BASE = 'https://api.eisenstecken.kivi.bz.it';

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false,
  })
  .catch(err => console.error(err));
