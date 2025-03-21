import {Component, computed, effect, inject, OnInit, Signal, WritableSignal} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from "../product-card/product-card.component";
import {Product} from '../../models/product.model';

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
  public products:Signal<Product[] | undefined> = toSignal(this.productService.getAllProducts());


  productCount:Signal<number>= computed(
    ()=> this.products.length,
  )

  centerStyle = {
    display:'flex',
    justifyContent:'center',
    flexWrap:'wrap',
    aligItems:'center'
  }
  alignStart: {
    display: string,
    justifyContent: string,
    flexWrap: string,
    alignItems: string,
    marginLeft: string
  }={
    display:'flex',
    justifyContent:'flex-start',
    flexWrap:'wrap',
    alignItems:'center',
    marginLeft:'6.2rem',
  }


}
