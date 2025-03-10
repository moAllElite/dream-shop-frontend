import { Routes } from '@angular/router';
import { ProductListComponent } from './product/components/product-list/product-list.component';
import { ProductDetailsComponent } from './product/components/product-details/product-details.component';
import { StepperComponent } from './product/components/stepper/stepper.component';
import {NewProductComponent} from './product/components/new-product/new-product.component';
import {AuthenticationComponent} from './security/components/authentication/authentication.component';
import {RegisterComponent} from './security/register/register.component';


export const routes: Routes = [
  {path:'',redirectTo:'products',pathMatch:'full'},
 {
      path: 'products',
   //   loadComponent:() => import('../app/product/product.route').then(m => m.productRoutes),
      children:[
        {path:'create', component:NewProductComponent,title:'Detail'},
        { path:'',component:ProductListComponent,title:'liste de produits'},
        { path:':id', component:ProductDetailsComponent,title:'Detail'},
      ]
    },
  {path:'signin',component:RegisterComponent,title:'Login'},
  {path:'signup',component:AuthenticationComponent,title:'Signup'},
];




