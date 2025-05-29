import { enableProdMode } from '@angular/core';
import * as moment from 'moment';
import { APP_CONFIG } from './environments/environment';
import { OpenAPI } from './client/api';
import * as Sentry from '@sentry/angular';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

console.log(
  'Eisenstecken App starting with environment: ' + APP_CONFIG.environment
);

Sentry.init({
  dsn: 'https://739b39d0b92749a485e48a80da87816e@sentry.kivi.bz.it/26',
  integrations: [],
  tracesSampleRate: 1.0, // adjust in production
});

moment.locale('de');

if (APP_CONFIG.production) {
  enableProdMode();
}

OpenAPI.BASE = 'https://api.eisenstecken.kivi.bz.it';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

console.log('Eisenstecken App started with base URL: ' + OpenAPI.BASE);
