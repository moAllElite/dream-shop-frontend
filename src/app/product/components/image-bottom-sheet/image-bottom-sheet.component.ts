import { Component, inject, input, InputSignal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ImageProductService } from '../../services/image-product.service';
import { ApiResponse } from '../../models/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from '../../../core/models/error-message';

@Component({
  selector: 'app-image-bottom-sheet',
  imports: [MatButtonModule, MatBottomSheetModule,ReactiveFormsModule,MatFormFieldModule,],
  templateUrl: './image-bottom-sheet.component.html',
  styleUrl: './image-bottom-sheet.component.css'
})
export class ImageBottomSheetComponent {
  readonly _formBuilder = inject(FormBuilder); //inject form builder

  //inject bottom sheet ref
  private readonly _bottomSheetRef =
  inject<MatBottomSheetRef<ImageBottomSheetComponent>>(MatBottomSheetRef);

  //inject image product service
    imageService :ImageProductService = inject(ImageProductService);
    idProduct:InputSignal<number> = input.required<number>();


  // form group for image upload
  form: FormGroup = this._formBuilder.group({
    image: ['', [Validators.required]],
  });

  //on close bottom sheet
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  // assign image to product and save it
  saveImage(){
    if(this.form.valid){
      this.imageService.uploadImageProduct(this.idProduct(),this.form.value)
      .subscribe(
        {
          next: (data):void=>{
            let message = (data as ApiResponse)?.message;
            //alert(data.message);
            this._bottomSheetRef.dismiss();
          },
          error: (err:HttpErrorResponse)=>{
            const message =( err.error as ErrorMessage)?.message
              alert(message);
          }
        });
    }
  }

}
