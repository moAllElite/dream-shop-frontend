import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../../product/models/api.response';
import {Observable} from 'rxjs';
import {Order} from '../models/order';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  host :string = environment.host;
  constructor(readonly  http: HttpClient) { }

  /**
   * place order
   * @param user_id
   */
  public placeOrder(user_id:number) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`/api/order/add?userId=${user_id}`, user_id)
  }

  public getOrderByUserId(user_id:number):Observable<ApiResponse| Order>{
    return this.http
      .get<ApiResponse | Order>(`${this.host}/api/v1/orders/${user_id}`)
  }
}
