import {
  Component,
  computed,
  DestroyRef,
  inject, input, OnDestroy,
  OnInit,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from "../product-card/product-card.component";
import {ProductPage} from '../../models/product.page.model';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import { MatButtonModule} from '@angular/material/button';
import {MatSliderModule,} from '@angular/material/slider';
import { Subscription} from 'rxjs';
import { MatIconModule} from '@angular/material/icon';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Product} from '../../models/product.model';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ImageBottomSheetComponent} from '../image-bottom-sheet/image-bottom-sheet.component';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent,MatDrawerContainer,
    MatIconModule,
    MatDrawer, MatSliderModule, MatButtonModule,  MatPaginator],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit,OnDestroy {

  public productsPage: WritableSignal<ProductPage| null> = signal(null) ;

  pageSize:number= 50;
  pageIndex:number = 0;
  length:number=50;
  pageEvent!:PageEvent;
  productSubscription:Subscription = new Subscription();
  productService:ProductService = inject(ProductService);
  public productCount:Signal<number>= computed(()=> this.productsPage.length,);
  products = input<Product[]>();
  handlePageEvent(e:PageEvent){
    this.pageEvent = e;
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.length = e.length;
    // update the product page
    this.fetchAllProducts(this.pageSize,this.pageIndex);
  }

  ngOnInit(): void {
    this.fetchAllProducts(this.pageSize,this.pageIndex);//get all products
  }
  productFilteredSubscription:Subscription = new Subscription();
  //get paginated product
  fetchAllProducts(size:number,page:number){
  this.productSubscription =  this.productService.getAllProducts(size,page).subscribe(
      {
        next:(values:ProductPage) => {
          this.productsPage.set(values);
          // this.products() =[...values.content]
          return values;
        }
      }
    );
    return this.productsPage;
  }





  /**
   * slider parameters
   */

  maxi :number= 10000000;
  mini:number =0;

  destroy$ !:DestroyRef;
  filterPriceByMinMax() {
    this.productFilteredSubscription =  this.productService.searchByRangePriceProducts(this.mini,this.maxi)
      .subscribe((products:ProductPage) => {
        this.productsPage.set(products!)
      });
  }

  //show min & max value on range slider
   formatLabel(value: number): string {
    if (value >= 1000) {
       return Math.round(value / 1000) + 'k';
     }
    if(value >= 1000000 ) {
      return Math.round(value / 100000) + 'm';
    }

     return `${value}`;
   }


  ngOnDestroy(): void {
    this.productFilteredSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
  }



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

  private _bottomSheet = inject(MatBottomSheet);
  showBtnsheet() {
    this._bottomSheet.open(ImageBottomSheetComponent);
  }
}
