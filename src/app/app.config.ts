import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {loggingInterceptor} from './security/interceptors/logging.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([loggingInterceptor])
    ),
    provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),

    ],
};
