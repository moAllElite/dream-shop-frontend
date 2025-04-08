import { ApiResponse } from '../../models/api.response';
import {Component, inject,  ChangeDetectionStrategy, WritableSignal, signal} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from '../../../core/models/error-message';
import { MatCardModule } from '@angular/material/card';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ImageBottomSheetComponent} from '../image-bottom-sheet/image-bottom-sheet.component';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import {SnackBarComponent} from '../../../core/components/snack-bar/snack-bar.component';
import {Product} from '../../models/product.model';

@Component({
  selector: 'app-new-product',
  imports: [MatStepperModule,
    MatFormFieldModule,MatCardModule,
    MatInputModule,MatButtonModule,
    ReactiveFormsModule],
    providers:[ {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }],
    changeDetection:ChangeDetectionStrategy.OnPush,
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent  {
    productId: WritableSignal<number> = signal(0);
    productService :ProductService = inject(ProductService);//dependency inject
    private readonly _formBuilder = inject(FormBuilder);// dependency inject formbuilder
    private _bottomSheet:MatBottomSheet = inject(MatBottomSheet);
    snackBar:MatSnackBar = inject(MatSnackBar);
    //build product form
    public form:FormGroup = this._formBuilder.group({
      name:new FormControl ('' , Validators.required),
      inventory:new FormControl('',Validators.required),
      price:new FormControl('',Validators.required),
      brand: new FormControl('', Validators.required),
      category:new FormControl('',Validators.required),
      description: new FormControl('', Validators.required),
      image:new FormControl(null)
    });

    //inject errormessages
   constructor() {
   }
      /**
       * add new Product and save it before navigating to the product list
       */
      saveProduct() {
        this.productService.saveProduct(this.form.value)
        .subscribe(
          {
            next: (response:ApiResponse |ErrorMessage):void=>{
              const result:Product = (response as  ApiResponse).data;
              if(result.id) {
                this.productId.set(result.id);
                this.openBottomSheet();
              }
            },
            error:(err:HttpErrorResponse)=>{
              const error :string = ( err.error as ErrorMessage).message;
              this.openSnackBar(error,this.form); //show error & reset form
            }
          }
        );
      }
  //open bottom sheet
  openBottomSheet(): void {
    this._bottomSheet.open(ImageBottomSheetComponent,{
      data: { names: [this.productId()] },
    });
  }

  //show alert and reset form
   openSnackBar(message:string,form:FormGroup): void {
     let snackBarRef:MatSnackBarRef<SnackBarComponent> = this.snackBar.openFromComponent(SnackBarComponent,  {
       duration: 3000,
       data:message,
       horizontalPosition:'center'
     });
     snackBarRef.afterOpened().subscribe(() => {
       form.reset();
     });
   }

  }
