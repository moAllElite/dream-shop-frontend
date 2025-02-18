import { Component } from '@angular/core';
import { StepperComponent } from "../stepper/stepper.component";
import {MatGridList, MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-new-product',
  imports: [StepperComponent, MatGridListModule],
  standalone:true,
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {

}

