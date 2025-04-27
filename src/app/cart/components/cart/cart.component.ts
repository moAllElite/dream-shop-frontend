import {
  Component,
  DestroyRef, effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {CartService} from '../../services/cart.service'; import {ActivatedRoute, Router} from '@angular/router';
import {Cart} from '../../models/cart.model';
import {  Observable, Subscription, } from 'rxjs';
import {CartItem} from '../../models/cart-item.model';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {OrderService} from '../../../order/services/order.service';
import {CartItemService} from '../../services/cart-item.service';
import {ApiResponse} from '../../../product/models/api.response';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBarComponent} from '../../../core/components/snack-bar/snack-bar.component';
import {HttpErrorResponse} from '@angular/common/http';
import {LoadingSpinnerComponent} from '../../../core/components/loading-spinner/loading-spinner.component';
import {CartItemTableComponent} from '../cart-item-table/cart-item-table.component';
import {CurrencyPipe} from '@angular/common';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    FormsModule,
    FormsModule,
    MatPaginatorModule,
    LoadingSpinnerComponent,
    CartItemTableComponent,
    CurrencyPipe,
  ],
  templateUrl: './cart.component.html',
  standalone: true,
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  message: WritableSignal<string> =signal('');
  cart:WritableSignal <Cart | undefined> = signal(undefined);
  cartItems: WritableSignal<CartItem[]> = signal([]);
  cartService:CartService= inject(CartService);
  cartSubscription:Subscription = new Subscription();
  cartId:WritableSignal<number> = signal(0);

  //paginators parameters
  public length: number = 0;
  pageSize: number = 3;
  pageSizeOptions:number[] = [3,5, 10];
  pageIndex: number = 0;
  public dataSource!:any;
  userId: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private activedRoute: ActivatedRoute, private router: Router) {
    this.cartId.set(this.activedRoute.snapshot.params['id']);
    console.log(this.cartId())
  }



  //get cart information by cart's id
  ngOnInit(): void {
     const id:number = this.activedRoute.snapshot.params['id'];
     this.cartId.set(id);
     this.getCartItems(this.cartId());
  }

  //get cart item
    getCartItems(cart_id:number) :CartItem[] {
      this.cartSubscription = this.cartService.getCartByCartId(cart_id).subscribe(
        (cart:Cart) => {
          if (!cart) {
            return;
          }
          this.cart.set(cart);
          this.userId = cart.user!.id;
          this.cartItems.set(cart.items!);
          this.dataSource = new MatTableDataSource(cart.items?.slice(0,3));
          this.dataSource.paginator = this.paginator;
        }
      );
      this.length= this.cartItems().length;
      return this.cartItems();
    }

    //get the total price of item
  getTotalBillingAmount(): number {
   return this.cartItems().reduce((acc:number, item:CartItem) => acc + item.unitPrice! * item.quantity!, 0);
   // return  this.cart()!.totalAmount!;
  }


  //set pagination infos
  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateTableData();
  }



  orderService : OrderService = inject(OrderService);
  //order form
  onOrderProduct(form: NgForm) {
    if(form.valid){
      //todo update cart & cart item
    //  this.cart()?.items.forEach(item=>{})
      this.orderService.placeOrder(form.value.userId);
    }
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  //  this.cartItemSubscription.unsubscribe();
  }

  upgradeTable = effect(
    ()=>{
      return this.dataSource.data = this.cartItems().slice(0, this.pageSize);
    }
  )

  /**
   * update the page size item
   */
  private updateTableData() {
    const start:number = this.pageIndex * this.pageSize;
    const end:number = start + this.pageSize;
    this.dataSource.data = this.cartItems().slice(start, end);
  }


  /**
   * refresh cart item's table or get infos
   * @param cart_id
   */
  handleUpdateCartItem(cart_id:number) {
    this.getCartItems(cart_id);
  }


  cartResource =rxResource({
    request:()=> this.cartId(),
    loader:({request})=>{
      return this.cartService.getCartByCartId(request)
    }
  });

  /**
   * clear the cart by dropping cart contains
   * @param form
   */
  clearCart(form: NgForm) {
      if(form.valid){
        console.log(form.value);
        this.cartService.clearCart(this.cartId())
          .subscribe({
            next:(data:ApiResponse)=> {
              this.message.set(data.message);
              this.showSnackBar(this.message);
              this.router.navigate(['/']).then(() => {});
            },
            error:(data:HttpErrorResponse)=> {
              this.message.set(data.error.message);
              this.showSnackBar(this.message);
            }
          });
      }

  }


  snackBar:MatSnackBar = inject(MatSnackBar);

  /**
   * display snack bar
   * @param message
   * @private
   */
  private showSnackBar(message:WritableSignal<string>) {
    this.snackBar.openFromComponent(SnackBarComponent,{
      data:message(),
      duration:5000,
    })
  }
}
