import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {ApiResponse} from '../../product/models/api.response';
import {CartItem} from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartItemService {
  host: string = environment.host;
  constructor(private readonly http: HttpClient) { }

  /**
   * update cart item
   * @param quantity
   * @param cart_id
   * @param product_id
   * @param cartItem
   */
  updateCartItemByQuantity(quantity:number,cart_id:number,product_id:number,cartItem:CartItem):Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.host}/api/v1/cartItems/cart/${cart_id}/item/${product_id}/update?quantity=${quantity}}`,
      cartItem
    ) ;
  }

  /**
   * remove an item from cart
   * @param cart_id
   * @param cart_item_id
   */

  deleteCartItem(cart_id:number,cart_item_id:number):Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.host}/api/v1/cartItems/cart/${cart_id}/item/${cart_item_id}/remove`
    );
  }
}
