import { Component, inject, input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import {  Router } from '@angular/router';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
@Component({
  selector: 'app-product-card',
  imports: [MatCardModule,MatButtonModule,UpperCasePipe,TitleCasePipe],
  standalone:true,
  providers:[ProductService],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  router:Router = inject(Router);
 product = input.required<Product>();

 navigateToDetails(product:Product) {
    return this.router.navigateByUrl(`products/${product.id}`)
  }

}
