import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../user/models/user.model';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';
import {Payload} from '../models/payload.model';
import {AuthService} from './auth.service';
import {JwtDecodeService} from './jwt-decode.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private  host= environment.host+ '/api/v1/users';
  constructor(readonly http: HttpClient ,readonly authService: AuthService,readonly jwtDecodeService:JwtDecodeService) { }

  /**
   * get all users
   */
  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}`);
  }

  /**
   * get user by id
   */
  public getUserById(id:number): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/${id}`);
  }


  /**
   * get user email which is equal to the subject
   * @param token
   */
  public getUserEmailFromPayload(token:string):string | undefined {
    token = this.authService.getCookieToken();
    if(!token){return undefined;}
    const  payload:Payload |  null = this.jwtDecodeService.getPlayload(token);
    return   payload!.sub;
  }


}
