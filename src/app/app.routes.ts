import { Routes } from '@angular/router';
import { ProductListComponent } from './product/components/product-list/product-list.component';
import { ProductDetailsComponent } from './product/components/product-details/product-details.component';
import { StepperComponent } from './core/components/stepper/stepper.component';
 

export const routes: Routes = [
  {path:'',redirectTo:'products',pathMatch:'full'},
 {
      path: 'products',
      children:[
        { path:'',component:ProductListComponent,title:'liste de produits'},
        { path:':id', component:ProductDetailsComponent,title:'Detail'},
       
      ]
    },
    {path:'create', component:StepperComponent}
];




