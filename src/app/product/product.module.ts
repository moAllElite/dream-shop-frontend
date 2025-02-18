import { NgModule ,LOCALE_ID} from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //RouterModule.forChild(productRoutes),
  ],
  providers:[
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
})
export class ProductModule {
  constructor(){
    registerLocaleData(fr.default);
  }
}
