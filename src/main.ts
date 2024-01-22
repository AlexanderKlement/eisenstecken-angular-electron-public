import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as moment from 'moment';
import * as Sentry from '@sentry/angular-ivy';
import { AppModule } from './app/app.module';
import { APP_CONFIG } from './environments/environment';
import { OpenAPI } from './client/api';

Sentry.init({
  dsn: 'https://739b39d0b92749a485e48a80da87816e@sentry.kivi.bz.it/26',
  integrations: [
    // Registers and configures the Tracing integration,
    // which automatically instruments your application to monitor its
    // performance, including custom Angular routing instrumentation
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
    // Registers the Replay integration,
    // which automatically captures Session Replays
    new Sentry.Replay(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,
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
