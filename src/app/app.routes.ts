import { Routes } from '@angular/router';
import { ProductDetailsComponent } from './product/components/product-details/product-details.component';
import { ProductListComponent } from './product/components/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',redirectTo:'products',pathMatch:'full'
  },
  {
    path:'products',
    children:[
      {
        path:'',
        component:ProductListComponent
      },
      {
        path:':id',
       // loadChildren: ()=> import ()
       component:ProductDetailsComponent
      },

    ]
  }
];
