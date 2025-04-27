import {
  Component,
  inject,
  input,
  InputSignal,
  output, OutputEmitterRef,
  signal,
  WritableSignal
} from '@angular/core';
import {CurrencyPipe, TitleCasePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatInput} from '@angular/material/input';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField} from '@angular/material/form-field';
import {environment} from '../../../../environments/environment.development';
import {CartItem} from '../../models/cart-item.model';
import {CdkTableDataSourceInput, DataSource} from '@angular/cdk/table';
import {Observable, Subscription} from 'rxjs';
import {ApiResponse} from '../../../product/models/api.response';
import {HttpErrorResponse} from '@angular/common/http';
import {CartItemService} from '../../services/cart-item.service';
import {SnackBarComponent} from '../../../core/components/snack-bar/snack-bar.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CartComponent} from '../cart/cart.component';
import {MatCard, MatCardFooter} from '@angular/material/card';

@Component({
  selector: 'app-cart-item-table',
  imports: [
    CurrencyPipe,
    FormsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatInput,
    MatRow,
    MatRowDef,
    MatTable,
    ReactiveFormsModule,
    TitleCasePipe,
    MatHeaderCellDef,
    MatCardFooter,
    MatPaginator,
    MatCard
  ],
  templateUrl: './cart-item-table.component.html',
  styleUrl: './cart-item-table.component.css'
})
export class CartItemTableComponent {


  imageEndpoint: string = environment.imageEndpoint;
  imageByDefault: string = environment.defaultImage;

  readonly dataSource:InputSignal<CdkTableDataSourceInput<CartItem[]>> = input.required<CdkTableDataSourceInput<CartItem[]>>();
  cartItemService:CartItemService = inject(CartItemService);
  cartItemSubscription !: Subscription;
  cartItems:InputSignal<CartItem[]> = input.required<CartItem[]>();
  cartId:InputSignal<number> = input.required<number>();
  message:WritableSignal<string> = signal('');
  snackBar :MatSnackBar = inject(MatSnackBar);
  onCartItemRemoved:OutputEmitterRef<CartItem[]> = output<CartItem[]>();
  pageSize: InputSignal<number> = input.required<number>();
  pageSizeOptions: InputSignal<number[]> = input.required<number[]>();
  onPageEvent = output<PageEvent>();

  /**
   * delete cart item by index
   * @param index
   */
  removeItem(index: number) {
    const  cart_item_id :number = this.cartItems()[index].id;
    const  cart_id :number = this.cartId();
    this.cartItemSubscription = this.cartItemService.deleteCartItem(cart_id,cart_item_id).subscribe({
      next:(data:ApiResponse)=>{
        this.message.set(data.message);
        this.showSnackBar(this.message);
        // notifie les items du panier après suppression
        this.onCartItemRemoved.emit(this.cartItems())
      },
      error:(data:HttpErrorResponse)=>{
        this.message.set(data.error.message);
        this.showSnackBar(this.message)
      }
    })
  }


  /**
   * show snackbar
   * @param message
   * @private
   */

  private showSnackBar(message:WritableSignal<string>) {
    this.snackBar.openFromComponent(SnackBarComponent,{
      data:message(),
      duration:5000,
    })
  }

  handlePageEvent(event:PageEvent) {
    this.onPageEvent.emit(event);
  }

}
