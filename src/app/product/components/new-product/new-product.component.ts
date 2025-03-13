import { ApiResponse } from '../../models/api.response';
import { Component, inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { ProductService } from '../../services/product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from '../../../core/models/error-message';
import { MatCardModule } from '@angular/material/card';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';

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
    productId!: number;
    private readonly router:Router= inject(Router);
    productService :ProductService = inject(ProductService);//dependency inject
    private readonly _formBuilder = inject(FormBuilder);// dependency inject formbuilder
    response$!: Subscription;
    public form:FormGroup = this._formBuilder.group({
      name:new FormControl ('' , Validators.required),
      inventory:new FormControl('',Validators.required),
      price:new FormControl('',Validators.required),
      brand: new FormControl('', Validators.required),
      category:new FormControl('',Validators.required),
      description: new FormControl('', Validators.required),
      image:new FormControl(null)
    });
      /**
       * add new Product and save it before navigating to the product list
       */
      saveProduct(){
        this.productService.saveProduct(this.form.value)
        .subscribe(
          {
            next: (response:ApiResponse):void=>{
              alert(response.message);
              const result:Product = response.data as Product;
              this.productId = result.id;
             // this.router.navigateByUrl("/products");
            },
            error: (err)=>{
              const message = err
                console.log(err)
            }
          }
        );
      }



  }
