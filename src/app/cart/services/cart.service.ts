import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../product/models/api.response';
import {Cart} from '../models/cart.model';
import {CartItem} from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private host: string = environment.host;
  constructor(private readonly http: HttpClient) { }

  /**
   * add cart item on cart and save it
   * @param product_id
   * @param quantity
   * @param user_id
   * @param item
   */
  public addItemToCart(product_id: number,quantity:number,user_id:number,item:CartItem) :Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(
        `${this.host}/api/v1/cartItems/item/add?productId=${product_id}&quantity=${quantity}&userId=${user_id}`,
         item
      );
  }

  /**
   * get cart info by user id
   * @param user_id
   */
  public getCartByUserId(user_id:number):Observable<Cart> {
    return this.http.get<Cart>(`${this.host}/api/v1/carts/user?id=${user_id}`);
  }


  /**
   * get info by cart id
   * @param cart_id
   */
  getCartByCartId(cart_id:number):Observable<Cart> {
    return this.http.get<Cart>(`${this.host}/api/v1/carts/${cart_id}`);
  }

  clearCart(cart_id:number):Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.host}/api/v1/carts/${cart_id}/clear`);
  }
}
