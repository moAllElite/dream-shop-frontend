import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductPage } from '../models/product.page.model';
import { ApiResponse } from '../models/api.response';
import {ErrorMessage} from '../../core/models/error-message';
import {Product} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly host:string ='http://localhost:8080/api/v1/products';
  constructor(private readonly http:HttpClient) { } //dependency inject httpClient

  /**
   * get all products
   * @returns Observable<ArrayList<ProductPage>>
   */
  public getAllProducts( size?:number,page?:number):Observable<ProductPage>{
    if((size == undefined && page == undefined) || (size == null && page == null)){
      return this.http.get<ProductPage>(`${this.host}`);
    }
    return this.http.get<ProductPage>(`${this.host}?size=${size}&page=${page}`);
  }


  /**
   * filter products By minimum price & maximum
   * @param min_price
   * @param max_price
   */
  public searchByRangePriceProducts(min_price:number,max_price:number):Observable<ProductPage>{
    console.log(`${this.host}/search-by/prices?min=${min_price}&max=${max_price}`)
    return this.http.get<ProductPage>(`${this.host}/search-by/prices?min=${min_price}&max=${max_price}`);
  }

  /**
   * get product by brand
   * @param brand
   * @returns Observable of Product[]
   */
  public getProductByBrand(brand:string):Observable<Product[]>{
    return this.http
    .get<Product[]>(`${this.host}/search-by?brand=${brand}`);
  }
  /**
   * get product by category and brand
   * @param brand  like apple or samsung
   * @param name like iphone or galaxy
   * @returns product
   */
  public getProductByCategoryAndBrand(brand:string,name:string):Observable<Product[]>{
    return this.http
    .get<Product[]>(`${this.host}/search-by/name-and-brand?brand=${brand}&name=${name}`);
  }


  /**
   * search product by name
   * @param name product
   * @returns Observable<ProductPage[]>
   */
  public getProductByName(name:string):Observable<ProductPage>{
    return this.http.get<ProductPage>(`${this.host}/search/by?name=${name}`);
  }

  /**
   * search product by id
   * @param id of product
   * @returns Observable of Product[]
   */
  public getProductById(id:number):Observable<Product>{
    return this.http.get<Product>(`${this.host}/search-by/${id}`);
  }

  /**
   * add new product
   * @param product from Form
   * @returns Response message
   */
  public saveProduct(product:ProductPage):Observable<ApiResponse |ErrorMessage>{
    return this.http.post<ApiResponse | ErrorMessage>(`${this.host}/add`,product);
  }

  /**
   * update product informations
   * @param product from  Form
   * @returns Response
   */

  public updateProduct(product:ProductPage):Observable<Response>{
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
