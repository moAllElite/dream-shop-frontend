import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Image} from '../../models/image.model';
import {environment} from '../../../../environments/environment.development';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-product-image-list-item',
  imports: [],
  templateUrl: './product-image-list-item.component.html',
  styleUrl: './product-image-list-item.component.css'
})
export class ProductImageListItemComponent {
  @Input()
  image?: Image ;

  testImg= "https://cdn.pixabay.com/photo/2025/02/17/19/50/mysterious-9413772_1280.jpg";

  @Output()
  click:EventEmitter<void> = new EventEmitter<void>();
  host:string = environment.host;


  onImageListItemClick(imageListItem: Image) {
    this.click.emit();
  }




}
