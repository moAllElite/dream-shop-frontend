import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  providers:[ProductService],
  standalone:true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent  implements OnInit{

  productService = inject(ProductService);
  public products = toSignal(this.productService.getAllProducts());
  ngOnInit(): void {
    console.log(this.products());
  }
}
