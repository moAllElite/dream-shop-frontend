import {Component, computed, effect, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from "../product-card/product-card.component";
import {Product} from '../../models/product.model';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatButton} from '@angular/material/button';
import {MatSlider, MatSliderModule, MatSliderRangeThumb} from '@angular/material/slider';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent, MatDrawerContainer, MatButton, MatDrawer, MatSliderModule, MatSliderRangeThumb],
  providers:[ProductService],
  standalone:true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent{
  productService = inject(ProductService);
  public products:Signal<Product[] | undefined> = toSignal(this.productService.getAllProducts()); //get all products
  showFiller = false;


  productCount:Signal<number>= computed(()=> this.products.length,);

  /**
   * slider parameters
   */
  disabled:boolean = false;
  max :WritableSignal<number>= signal(100);
  min:WritableSignal<number> =signal (0);
  showTicks:WritableSignal<boolean> = signal(false);
  step:WritableSignal<number>= signal(1);
  thumbLabel:WritableSignal<boolean> = signal(false);






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
