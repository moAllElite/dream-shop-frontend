import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute,} from '@angular/router';
import { ProductService } from '../../services/product.service';
import {  map } from 'rxjs';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  standalone:true,
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
