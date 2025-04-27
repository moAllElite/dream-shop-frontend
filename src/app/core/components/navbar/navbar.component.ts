import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef, effect,
  inject, input, InputSignal, OnDestroy,
  OnInit, Signal,
  signal, ViewChild, viewChild,
  WritableSignal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import {Router, RouterLink} from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import {NavItemButton} from '../../models/name.item.button';
import {CommonModule, TitleCasePipe} from '@angular/common';
import {AuthService} from '../../../security/services/auth.service';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { ProductPage} from '../../../product/models/product.page.model';
import { ProductService } from '../../../product/services/product.service';
import { map, Observable, startWith, Subscription} from 'rxjs';
import {MatInput} from '@angular/material/input';
import {MatBadge} from '@angular/material/badge';
import { CartService } from '../../../cart/services/cart.service';
import { UserService } from '../../../security/services/user.service';
import {User} from '../../../user/models/user.model';
import {Cart} from '../../../cart/models/cart.model';
import {Product} from '../../../product/models/product.model';
import { environment } from '../../../../environments/environment.development';
import {SnackBarComponent} from '../snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ProductListComponent} from '../../../product/components/product-list/product-list.component';
import {CartComponent} from '../../../cart/components/cart/cart.component';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatMenuModule,
    CommonModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatLabel,
    MatListModule, RouterLink, TitleCasePipe, MatAutocomplete, MatOption, MatFormField, ReactiveFormsModule, MatAutocompleteTrigger, MatInput, MatBadge],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush,
})

export class NavbarComponent implements OnInit,OnDestroy {


  isAuthenticated:InputSignal<boolean> = input.required<boolean>();
  themeService:ThemeService = inject(ThemeService); //inject the theme in order to switch between light &dark mode
  authService:AuthService = inject(AuthService); // inject authentification service
  productNameControl = new FormControl<string  >('');
  options!:Product[] ; // list of products
  host:string = environment.host;
  message = signal('');
  private destroyRef:DestroyRef = inject(DestroyRef);
  filteredOptions!: Observable<Product[]>//;
  private prodSub!: Subscription;
  private cartSubscription!:Subscription;
  router :Router = inject(Router);
  userSubscription!:Subscription;
   user:InputSignal<User> = input.required<User>() ;
  cartItemLength:InputSignal<number> = input.required<number>() ;
  cart:InputSignal<Cart> = input.required<Cart>() ;


  /**
   * show
   */
  ngOnInit():void {
   this.getProductsNameForAutoCompleteSelector();
    this.filteredOptions = this.productNameControl.valueChanges.pipe(
      startWith(''),
      map((value:Product| null | string) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options?.slice();
      }),
    );
    this.destroyRef.onDestroy(()=> this.userSubscription.unsubscribe());
  }


  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }



  /**
   * get the product's for auto complete selector
   */
  getProductsNameForAutoCompleteSelector():void {
    // this.prodSub = this.productService.getAllProducts()
    //   .pipe(
    //     map(
    //       (products:ProductPage) => {
    //         this.options = [...products.content];
    //         return  products;
    //       }
    //     )
    //   )
    //   .subscribe({complete:()=>{}})
    // this.destroyRef.onDestroy(()=> this.prodSub.unsubscribe());
  }

  /**
   * send user to cart view if user authenticated otherwise
   * send him on login page
   */
  navigateToCart() {
    const loggedUser:User  = this.user();
    if (!loggedUser) {
      this.message.set("Veuillez vous connecter afin accèder au panier");
      this.openSnackBar(this.message());
      this.router.navigateByUrl('signup').then(() => {});
    }else  if(this.cart().items!.length == 0) {
      this.message.set("Votre panier est vide veuillez ajoutée des produits");
      this.openSnackBar(this.message());
    } else {
      this.router.navigate([`cart/${this.cart()?.id}`]).then(() => {});
    }

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
   * open snack bar
   */
    snackBar = inject(MatSnackBar);
    openSnackBar(message: string) {
      this.snackBar.openFromComponent(SnackBarComponent, {data: message});
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
