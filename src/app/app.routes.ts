import { Routes } from '@angular/router';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',redirectTo:'products',pathMatch:'full'
  },
  {
    path:'products',
    children:[
      {
        path:':id',
       // loadChildren: ()=> import ()
       component:ProductDetailsComponent
      },
      {
        path:'',
        component:ProductListComponent
      }
    ]
  }
];
