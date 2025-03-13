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
  /**
   *
   * @param imageId show image by id
   * @returns image
   */
  getImagesProduct(imageId: number):Observable<Image> {
    return this.http.get<Image>(`${this.host}/images/image/download/${imageId}`);
  }

  /*
  * upload image and assign it to product by product id
  */
  uploadImageProduct(product_id:number,image: Image):Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.host}/upload?productId=${product_id}`, image);
  }
}
