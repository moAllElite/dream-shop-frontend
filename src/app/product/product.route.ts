import { RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { Routes,  Router } from '@angular/router';
import { ProductDetailsComponent } from "./components/product-details/product-details.component";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { NewProductComponent } from './components/new-product/new-product.component';
import { StepperComponent } from '../core/components/stepper/stepper.component';

 /* const productRoutes:Routes = [
    {
      path: '',
     
      children:[
        { path:'',component:ProductListComponent,title:'liste de produits'},
        { path:':id', component:ProductDetailsComponent,title:'Detail'},
        {path:'new', component:StepperComponent}
      ]
    }
];

export default productRoutes;*/