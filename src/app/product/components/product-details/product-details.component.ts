import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute,} from '@angular/router';
import { ProductService } from '../../services/product.service';
import {  map } from 'rxjs';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import {environment} from '../../../../environments/environment.development';
import {Image} from '../../models/image.model';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  image= environment.imageEndpoint;
  imageDefault= environment.defaultImage;

  private readonly route :ActivatedRoute= inject(ActivatedRoute);
  private readonly productService:ProductService= inject(ProductService);
  productId :WritableSignal<number>=signal(this.route.snapshot.params['id']);

 public product:Signal<Product | undefined> = toSignal(
    this.productService.getAllProducts()
      .pipe((
        map(
          (products:Product[])=>{ return products.find((p) => {
            return p.id == this.productId()
          })}
        ))
      )
  );

  /**
   * select the first image's product
   */
  oneImageProduct: Signal<Image | undefined> = computed(() => {
    const prod: Product | undefined = this.product();
    return prod?.images?.[0];
  });


}
