import {Component, DestroyRef, Inject, inject, input, InputSignal, signal,   WritableSignal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ImageProductService } from '../../services/image-product.service';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {Subscription} from 'rxjs';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import {SnackBarComponent} from '../../../core/components/snack-bar/snack-bar.component';
import {MatNavList} from '@angular/material/list';



@Component({
  selector: 'app-image-bottom-sheet',
  imports: [MatButtonModule, MatBottomSheetModule, MatIconModule, ReactiveFormsModule,
    MatFormFieldModule, ],
  templateUrl: './image-bottom-sheet.component.html',
  styleUrl: './image-bottom-sheet.component.css'
})
export class ImageBottomSheetComponent {

  formBuilder: FormBuilder= inject(FormBuilder);
  // Initialisation du formulaire avec validation
  form:FormGroup = this.formBuilder.group({
    image: ['', Validators.required]
  });

  previewUrls: WritableSignal<string[]> = signal([]); // Pour afficher les aperçus d'image
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  //inject bottom sheet ref
  private _bottomSheetRef =
  inject<MatBottomSheetRef<ImageBottomSheetComponent>>(MatBottomSheetRef);

  //inject image product service
    imageService :ImageProductService = inject(ImageProductService);
    idProduct:InputSignal<number> = input.required<number>();
    private _destroyRef:DestroyRef = inject(DestroyRef); //inject destroy
  imageSub:Subscription = new Subscription();

  //inject product's Id
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { names:number }) { }
  router: Router = inject(Router);//INJECT ROUTER
  file: File | null = null; // Variable to store file
  selectedFiles: WritableSignal<File[]> = signal([]);

  // assign image to product , save it and navigate on home
 onSave(productId: number) {
   if (this.form.invalid || this.selectedFiles().length === 0) {
     alert("Veuillez sélectionner une image et un produit.");
     return;
   }
   const formData = new FormData();
   this.selectedFiles().forEach(file => {
     formData.append('files', file); // Clé "files" doit correspondre au backend
   });

   formData.append('productId', productId.toString());
    this.imageSub=  this.imageService.uploadImageProduct(productId,formData).subscribe(
        {
          next: ()=> {
            this.openSnackBar("Image uploaded successfully.");
            this._bottomSheetRef.dismiss();
            this.router.navigateByUrl(`/`).then();
          },error: (err) => {
            console.error("Upload failed:", err);
            this.openSnackBar("Échec de l'upload de l'image.");
          }
        }
      );
    //nettoyage et libération des ressources
    this._destroyRef.onDestroy(
      ()=> this.imageSub.unsubscribe()
    );

  }

  /**
   * Gère la sélection des fichiers
   */
  /**
   * Gère la sélection des fichiers
   */
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files  && input.files.length > 0) {
      this.selectedFiles.set(Array.from(input.files));
      // Génération des aperçus des images
      const urls:string[] = this.selectedFiles().map((file:File) => URL.createObjectURL(file));
      this.previewUrls.set(urls);
    }
  }

  snackBar:MatSnackBar = inject(MatSnackBar);
  //show alert
  openSnackBar(message:string): void {
    let snackBarRef:MatSnackBarRef<SnackBarComponent> = this.snackBar.openFromComponent(SnackBarComponent,  {
      duration: 3000,
      data:message,
      horizontalPosition:'center'
    });
    snackBarRef.afterOpened().subscribe(() => {
      this.form.reset();
    });
  }
}
