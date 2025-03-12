import { Component, inject, input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { ProductService } from '../../services/product.service';
import {  Router } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Product } from '../../models/product.model';
@Component({
  selector: 'app-product-card',
  imports: [MatCardModule,MatButtonModule,CurrencyPipe,TitleCasePipe],
  standalone:true,
  providers:[ProductService],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  router:Router = inject(Router);
 public product = input.required<Product>();
 image=`http://localhost:8080/api/v1/images/image/download/`
 imageDefault= 'https://placehold.co/400';

 navigateToDetails(product:Product) {
    return this.router.navigateByUrl(`products/${product.id}`)
  }

}
