import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef, effect,
  inject, OnDestroy,
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


  countCartItems :WritableSignal<number>= signal(0);
  productService: ProductService = inject(ProductService);
  themeService:ThemeService = inject(ThemeService); //inject the theme in order to switch between light &dark mode
  authService:AuthService = inject(AuthService); // inject authentification service
  productNameControl = new FormControl<string  >('');
  options!:Product[] ; // list of products
  host:string = environment.host;
  message = signal('');
  userService:UserService = inject(UserService);
  cartService:CartService = inject(CartService);
  private destroyRef:DestroyRef = inject(DestroyRef);
  filteredOptions!: Observable<Product[]>//;
  cart:WritableSignal<Cart| undefined> = signal(undefined);
  user:WritableSignal<User | undefined> = signal(undefined);
  private prodSub!: Subscription;
  private cartSubscription!:Subscription;
  router :Router = inject(Router);
  userSubscription!:Subscription;
  headerProduct = viewChild(ProductListComponent);
  /**
   * show
   */
  ngOnInit():void {
   // this.getProductsNameForAutoCompleteSelector();

    if(this.isAuthenticated()) {
      this.userSubscription =  this.userService.getAllUsers()
        .subscribe(users => {
         const currentCart:WritableSignal<Cart| undefined>= this.getCartItemLength(this.isAuthenticated(), users)!;
          console.log(this.countCartItems())
        });
    }

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
   * check if user is authenticated
   */
  public isAuthenticated():boolean {
    return !!this.authService.getCookieToken();
  };


  //get all users
  allUsers:Signal<User [ ]| undefined> = toSignal(
    this.userService.getAllUsers()

  );
  /**
   * get cart items
   * @param isAuthenticated
   * @param users
   */
  cartItemLength = signal(0);
  cartItemLengthEffect  = effect(
    ()=> {
     const isUserAuthenticated:boolean= !this.authService.getCookieToken();
      if(this.allUsers()){
        const user: User | undefined = this.getAuthenticatedUser(isUserAuthenticated, this.allUsers());
        return this.cartService.getCartByUserId(user!.id)
          .pipe(
            map((value)=>{
              this.cartItemLength.set(value.items!.length)
            })
          );
      }else {
        return ;
      }

    }
  )
  getCartItemLength(isAuthenticated:boolean, users:User[]) {
    const user: User | undefined = this.getAuthenticatedUser(isAuthenticated, users);
    if (!user) {
      this.message.set("Utilisateur non authentifié ou non trouvé");
      this.openSnackBar(this.message());
      return;
    }

   this.cartSubscription = this.cartService.getCartByUserId(user.id).subscribe({
      next: (result: Cart) => {
        this.cart.set(result); // Évite undefined
        const counter:number |undefined = result?.items?.length;
        this.countCartItems.set(counter!);
        this.user.set(user);
        console.log(this.countCartItems());
      },
      error: (err) => {
       // console.error(" :", err);
        this.message.set("Erreur lors de la récupération du panier");
        this.openSnackBar(this.message());
      }
    });
    this.destroyRef.onDestroy(()=>this.cartSubscription);
    return this.cart;
  }



  /**
   * check if user is authenticated and return user
   * @param isAuthenticated
   * @param users
   */
  getAuthenticatedUser(isAuthenticated:boolean, users:User[] | undefined ):User | undefined{
    const token:string = this.authService.getCookieToken();
    if(!isAuthenticated && token == '' && users == undefined) {
      return ;
    }
    const  userEmail : string= this.userService.getUserEmailFromPayload(token)!;
    return users!.find(user=>user.email == userEmail)!;
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
    const loggedUser:User | undefined = this.user();
    if (!loggedUser) {
      this.message.set("Veuillez vous connecter afin accèder au panier");
      this.openSnackBar(this.message());
      this.router.navigateByUrl('signup').then(() => {});
    }else  if(this.cart()!.items!.length == 0) {
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
