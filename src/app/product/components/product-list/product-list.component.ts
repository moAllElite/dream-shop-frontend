import { Component, computed, inject, OnInit, WritableSignal } from '@angular/core';
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
export class ProductListComponent{

  productService = inject(ProductService);
  public products = toSignal(this.productService.getAllProducts());
 
  centerStyle :any= {
    display:'flex',
    justifyContent:'center',
    flexWrap:'wrap',
    aligItems:'center'
  }
  alignStart={
    display:'flex',
    justifyContent:'flex-start',
    flexWrap:'wrap',
    alignItems:'center',
    marginLeft:'6.2rem',

  }


}
