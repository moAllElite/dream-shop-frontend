import { Routes } from '@angular/router';
import { ProductListComponent } from './product/components/product-list/product-list.component';
import { ProductDetailsComponent } from './product/components/product-details/product-details.component';
 import {AuthenticationComponent} from './security/components/authentication/authentication.component';
import { RegisterComponent } from './security/components/register/register.component';
import { NewProductComponent } from './product/components/new-product/new-product.component';
import {CartComponent} from './cart/components/cart/cart.component';
import {OrderComponent} from './order/components/order/order.component';


export const routes: Routes = [
  {path:'',redirectTo:'products',pathMatch:'full'},
 {
      path: 'products',
   //   loadComponent:() => import('../app/product/product.route').then(m => m.productRoutes),
      children:[
        {path:'create', component:NewProductComponent,title:'Nouveau produit'},
        { path:'',component:ProductListComponent,title:'liste de produits'},
        { path:':id', component:ProductDetailsComponent,title:'Detail'},
      ]
    },
  {path:'signin',component:RegisterComponent,title:'Register'},
  {path:'signup',component:AuthenticationComponent,title:'Signin'},
  {
    path:'cart',
    children:[
      {path:':id',component:CartComponent,title:'Cart'},
    ]
  },
  {
    path:'orders',component:OrderComponent,title:'Orders'
  }
];




