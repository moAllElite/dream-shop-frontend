import {ApplicationConfig, importProvidersFrom, inject, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import {loggingInterceptor} from './security/interceptors/logging.interceptor';
import {JwtModule} from '@auth0/angular-jwt';
import {AuthService} from './security/services/auth.service';
import {provideClientHydration, withEventReplay, withIncrementalHydration} from '@angular/platform-browser';




//get token from cookie storage
export function tokenGetter(){
  const authService:AuthService = inject(AuthService);
  return authService.getCookieToken();
}



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    //decode jwt
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["http://localhost:4200","http://localhost:8080"],
        },
      }),
    ),
    provideAnimationsAsync(),
    //inject logging interroceptor
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([loggingInterceptor])
    ),
    provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),
    //for incremental hydration
    provideClientHydration(withIncrementalHydration(),withEventReplay())
    ],
};
