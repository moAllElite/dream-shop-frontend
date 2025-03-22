import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiResponse } from '../models/api.response';
import {ErrorMessage} from '../../core/models/error-message';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly host:string ='http://localhost:8080/api/v1/products';
  constructor(private readonly http:HttpClient) { } //dependency inject httpClient

  /**
   * get all products
   * @returns Observable<ArrayList<Product>>
   */
  public getAllProducts():Observable<Product[]>{
    return this.http.get<Product[]>(`${this.host}`);
  }

  /**
   * filter products By minimum price & maximum
   * @param min_price
   * @param max_price
   */
  public searchByRangePriceProducts(min_price:number,max_price:number):Observable<Product[]>{
    return this.http.get<Product[]>(`${this.host}/prices?min=${min_price}&max=${max_price}`);
  }

  /**
   * get product by brand
   * @param brand
   * @returns Observable of Product[]
   */
  public getProductByBrand(brand:string):Observable<Product[]>{
    return this.http
    .get<Product[]>(`${this.host}/find-by?brand=${brand}`);
  }
  /**
   * get product by category and brand
   * @param brand  like apple or samsung
   * @param name like iphone or galaxy
   * @returns product
   */
  public getProductByCategoryAndBrand(brand:string,name:string){
    return this.http
    .get<Product[]>(`${this.host}/by/name-and-brand?brand=${brand}&name=${name}`);
  }


  /**
   * search product by name
   * @param name product
   * @returns Observable<Product[]>
   */
  public getProductByName(name:string):Observable<Product>{
    return this.http.get<Product>(`${this.host}/search/by?name=${name}`);
  }

  /**
   * search product by id
   * @param id of product
   * @returns Observable<Product[]>
   */
  public getProductById(id:number):Observable<Product>{
    return this.http.get<Product>(`${this.host}/${id}`);
  }

  /**
   * add new product
   * @param product from Form
   * @returns Response message
   */
  public saveProduct(product:Product):Observable<ApiResponse |ErrorMessage>{
    return this.http.post<ApiResponse | ErrorMessage>(`${this.host}/add`,product);
  }

  /**
   * update product informations
   * @param product from  Form
   * @returns Response
   */

  public updateProduct(product:Product):Observable<Response>{
    return this.http.put<Response>(`${this.host}update`,product);
  }


  /**
   *
   * @param id product
   * @returns Response
   *delete product by id
   */
  public deleteProductById(id:number):Observable<Response>{
    return this.http.delete<Response>(`${this.host}delete/${id}`);
  }


}
