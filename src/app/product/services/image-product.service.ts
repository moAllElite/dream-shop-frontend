import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from '../models/image.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api.response';

@Injectable({
  providedIn: 'root'
})
export class ImageProductService {
  private readonly host:string ='http://localhost:8080/api/v1/images';
  constructor(readonly http:HttpClient) { } //dependency inject httpClient

  /*
  * upload image and assign it to product by product id
  */
  uploadImageProduct(product_id: number, images:FormData):Observable<ApiResponse> {
    // const files = new FormData();
    // for (let image of images){
    //   files.append(image.name,image);
    // }

    return this.http.post<ApiResponse>(`${this.host}/upload?productId=${product_id}`, images);
  }
}
