import { Component, inject, input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { ProductService } from '../../services/product.service';
import {  Router } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { environment } from '../../../../environments/environment.development';

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

 image= environment.imageEndpoint;
 imageDefault= environment.defaultImage;

 navigateToDetails(product:Product) {
    return this.router.navigateByUrl(`products/${product.id}`)
  }

}
