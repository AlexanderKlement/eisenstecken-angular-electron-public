import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import {Integrations} from '@sentry/tracing';
import * as moment from 'moment';
import {AppModule} from './app/app.module';
import {APP_CONFIG} from './environments/environment';
import {LocalConfigRenderer} from './app/LocalConfigRenderer';


Sentry.init({
    dsn: 'https://739b39d0b92749a485e48a80da87816e@sentry.kivi.bz.it/26',
    integrations: [
        new Integrations.BrowserTracing(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.5,
});

LocalConfigRenderer.getInstance().init();


moment.locale('de');

if (APP_CONFIG.production) {
    enableProdMode();
}


platformBrowserDynamic()
    .bootstrapModule(AppModule, {
        preserveWhitespaces: false
    })
    .catch(err => console.error(err));



