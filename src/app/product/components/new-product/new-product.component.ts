import { Component } from '@angular/core';
import { StepperComponent } from "../../../core/components/stepper/stepper.component";

@Component({
  selector: 'app-new-product',
  imports: [StepperComponent],
  standalone:true,
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {

}

