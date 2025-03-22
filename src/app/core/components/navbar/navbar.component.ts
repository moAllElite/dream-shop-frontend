import {Component, computed, DestroyRef, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import {NavItemButton} from '../../models/name.item.button';
import {CommonModule, TitleCasePipe} from '@angular/common';
import {AuthService} from '../../../security/services/auth.service';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Product} from '../../../product/models/product.model';
import { ProductService } from '../../../product/services/product.service';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {filter, map, Observable, startWith, Subscription} from 'rxjs';
import {MatInput} from '@angular/material/input';
import {MatBadge} from '@angular/material/badge';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatMenuModule,
    CommonModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatLabel,
    MatListModule, RouterLink, TitleCasePipe, MatAutocomplete, MatOption, MatFormField, ReactiveFormsModule, MatAutocompleteTrigger, MatInput, MatBadge],
  standalone:true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {
  countCartItems :WritableSignal<number>= signal(0);
  productService: ProductService = inject(ProductService);
  themeService:ThemeService = inject(ThemeService); //inject the theme in order to switch between light &dark mode
  authService:AuthService = inject(AuthService); // inject authentification service
  productNameControl = new FormControl<string  >('');
  options!:Product[] ;


  /**
   * check if user is authenticated
   */
  isAuthenticated():boolean{
    return !!this.authService.getCookieToken();
  };
  private destroyRef:DestroyRef = inject(DestroyRef);

  filteredOptions!: Observable<Product[]>//;
  prodSub = new Subscription();
  /**
   * sh
   */
  ngOnInit():void {
    const  productList:string[]= [];
    this.prodSub = this.productService.getAllProducts()
      .pipe(
        map(
          (products:Product[]) => {
            this.options = [...products];
            return  products;
          }
        )
      )
      .subscribe({complete:()=>{}})
    this.destroyRef.onDestroy(()=> this.prodSub.unsubscribe());

    this.filteredOptions = this.productNameControl.valueChanges.pipe(
      startWith(''),
      map((value:Product| null | string) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options?.slice();
      }),
    );
  }

  /**
   * show product's name on field
   * @param product
   */
  displayFn(product: Product): string {
    return product && product.name ? product.name : '';
  }

  /**
   * filter by product's name
   * @param name
   * @private
   */
  private _filter(name: string): Product[] {
    const filterValue:string = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  /**
   * logout & destroy cookie access token
   */
  logout() {
    this.authService.destroyCookieToken();
  }

  /**
   * nav bar main navigation buttons
   */
  navItem:NavItemButton[] =[
    {
      name:'Accueil',
      route:'',
      icon:'home'
    },
    {
      name:'Produit',
      route:'/products',
      icon:'shopping_cart'
    },
    {
      name:'Ajouter produit',
      route:'/products/create',
      icon:''
    }
  ]
  /**
   * login & register buttons
   */
  navigationButtons:NavItemButton[] =[
    {
      name:'connexion',
      icon:'person',
      route:'/signup',
    },
    {
      name:'inscription',
      icon:'add_circle',
      route:'/signin',
    }
  ] ;

}
