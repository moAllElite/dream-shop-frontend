import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Route, Routes } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent  implements OnInit{

  private readonly route :ActivatedRoute= inject(ActivatedRoute);
  private readonly productService:ProductService= inject(ProductService);
  productId :WritableSignal<number>=signal(this.route.snapshot.params['id']);

 public product= toSignal(
    this.productService.getAllProducts()
      .pipe((
        map(
          (products:Product[])=>{ return products.find((p) => {
            return p.id == this.productId()
          })}
        ))
      )
  );
  ngOnInit(): void {
    console.log(this.productId()) ;
  }

}
