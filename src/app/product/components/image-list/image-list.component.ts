import {
  Component,
  input,
  Input,
  InputSignal, output,
 OutputEmitterRef,
} from '@angular/core';
import {ProductImageListItemComponent} from '../product-image-list-item/product-image-list-item.component';
import {Image} from '../../models/image.model';
import {coerceNumberProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'app-product-image-list',
  imports: [
    ProductImageListItemComponent
  ],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.css'
})
export class ImageListComponent {

  @Input()
  idImage!:number;
  images:InputSignal<Image[]> = input.required();
  // @Output()
  // click:EventEmitter<Image> = new EventEmitter<Image>();

  @Input()
  get layoutGap() {
    return this._layoutGap;
  }
  set layoutGap(value: number) {
    // default to 15
    this._layoutGap = (value !== undefined) ? coerceNumberProperty(value) : 5;
  }
  private _layoutGap = 15;

  onImageUpdate:OutputEmitterRef<Image> = output<Image>()
  /**
   * update image on click
   * @param imageListItem
   */
  onImageListItemClick(imageListItem: Image) {
    this.onImageUpdate.emit(imageListItem);
    this.idImage =imageListItem.id;
  }


}
