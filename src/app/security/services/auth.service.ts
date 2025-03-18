import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {Observable} from 'rxjs';
import {BearerToken} from '../models/bearer-token';
import {ErrorMessage} from '../../core/models/error-message';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly HOST: string = 'http://localhost:8080/api/v1/auth';
  constructor(private http:HttpClient,private cookieService: CookieService) { }

  /**
   * register a new user
   * @param user from body
   */
  public register(user:User):Observable<BearerToken|ErrorMessage> {
    return this.http.post<BearerToken | ErrorMessage>(`${this.HOST}/register`, user);
  }

  /**
   * get user authenticate
   * @param user
   */
  public  login(user:User):Observable<BearerToken | ErrorMessage> {
    return this.http.post<BearerToken |ErrorMessage>(`${this.HOST}/signin`, user);
  }

  /**
   *  storage token in cookie
   */
  public setCookieToken(token:string):void{
    this.cookieService.set('token', token);
  }

  /**
   * get bearer token
   *
   */
  public getCookieToken():string{
    return   this.cookieService.get('token');
  }

  /**
   * logout by destroying bearer token in the cookie
   */
  public destroyCookieToken():void{
    this.cookieService.delete('token');
  }
}

