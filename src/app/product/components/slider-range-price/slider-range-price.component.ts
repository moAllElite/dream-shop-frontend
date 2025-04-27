import {Component, input, InputSignal} from '@angular/core';
import {MatSlider, MatSliderRangeThumb} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-slider-range-price',
  imports: [
    MatSlider,
    MatSliderRangeThumb,
  ],
  templateUrl: './slider-range-price.component.html',
  styleUrl: './slider-range-price.component.css'
})
export class SliderRangePriceComponent {
  max:InputSignal<number> = input.required<number>();
  min:InputSignal<number> = input.required<number>();
//  formatLabel:InputSignal<string> = input.required<string>();



}
