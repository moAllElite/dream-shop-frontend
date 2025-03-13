import {  HttpHandlerFn, HttpHeaders,   HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';


export function loggingInterceptor  (req:HttpRequest<unknown>, next:HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  let authService: AuthService= inject(AuthService);
  let  token:string  =authService.getCookieToken();

  if(!token) {
    return next(req);
  }
  // Clone the request to add the authentication header.
  const headers = new HttpHeaders({
    Authorization:`Bearer ${token}`
  })
  const newReq = req.clone({
    headers: headers,
  });
  return next(newReq);
}
