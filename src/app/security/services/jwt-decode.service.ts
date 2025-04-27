import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Payload} from '../models/payload.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JwtDecodeService {

  constructor(public jwtHelperService: JwtHelperService,public authService: AuthService) { }

  /**
   * Extract the Payload informations email ,issuer ,expired date ,issue at, subject
   * @param token
   */
  public getPlayload(token:string):Payload | null {
   return  this.jwtHelperService.decodeToken(token);
  }



}
