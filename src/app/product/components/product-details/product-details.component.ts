import {
  ChangeDetectionStrategy,
  Component,
  computed, DestroyRef, effect, EffectRef,
  inject, OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router,} from '@angular/router';
import { ProductService } from '../../services/product.service';
import {map, merge, Subscription} from 'rxjs';
import {CommonModule } from '@angular/common';
import {environment} from '../../../../environments/environment.development';
import {Image} from '../../models/image.model';
import {MatHint, MatInput, MatLabel} from '@angular/material/input';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatFabButton } from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {CartService} from '../../../cart/services/cart.service';
import {ImageListComponent} from '../image-list/image-list.component';
import {AuthService} from '../../../security/services/auth.service';
import {JwtDecodeService} from '../../../security/services/jwt-decode.service';
import {Payload} from '../../../security/models/payload.model';
import {UserService} from '../../../security/services/user.service';
import {User} from '../../../user/models/user.model';
import {ApiResponse} from '../../models/api.response';
import {SnackBarComponent} from '../../../core/components/snack-bar/snack-bar.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorMessage} from '../../../core/models/error-message';
import {Product} from '../../models/product.model';
import {CartItem} from '../../../cart/models/cart-item.model';
@Component({
  selector: 'app-product-details',
  imports: [CommonModule,
    MatFormFieldModule, MatInput, MatLabel, MatHint, ReactiveFormsModule,
    MatIcon, MatFabButton, ImageListComponent],
  standalone:true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent  implements OnInit {
  imageUrl:string= environment.imageEndpoint;
  imageDefault:string= environment.defaultImage;
  idImage:WritableSignal<number>=signal(0);

  /**
   * inject services
   */
  router:Router = inject(Router);
  userService:UserService = inject(UserService);
  cartService:CartService= inject(CartService);
  authService:AuthService = inject(AuthService);
  jwtDecodeService:JwtDecodeService = inject(JwtDecodeService);
  private readonly route :ActivatedRoute= inject(ActivatedRoute);
  private readonly productService:ProductService= inject(ProductService);
  productId :WritableSignal<number>=signal(this.route.snapshot.params['id']);
  quantity: WritableSignal<number> = signal(0);
  images: WritableSignal<Image[]> = signal([]);
  userEmail:WritableSignal<string> =signal('');
  errorMessageQuantity:WritableSignal<string> = signal<string>('');
  payload :WritableSignal<Payload | null> = signal(null);

  public product:Signal<Product | undefined> = toSignal(
    this.productService.getProductById(this.productId())
      .pipe((
          map(
            (product:Product)=> {
              this.images().push(...product.images);
              this.maxInventory.set(product.inventory);
              return product;
            })
        )
      )
  );
  private formBuilder = inject(FormBuilder);
  maxInventory:WritableSignal<number> = signal(0);
  readonly quantityControl = new FormControl('0', [
    Validators.min(1)
  ]);

  //quantity form
  form:FormGroup= this.formBuilder.group({
    quantity:this.quantityControl,
  });


  token:WritableSignal<string> =signal('')
  private cartSubscription: Subscription = new Subscription();

  constructor() {
    merge(this.quantityControl.statusChanges , this.quantityControl.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(()=>this.updateErrorQuantityMessage());
  }

  //get current user logged
  currentUser:Signal<User  | undefined> =  toSignal(
    this.userService.getAllUsers()
      .pipe(map(
        (users:User[]) => {
          return users.find( (user:User) => {
             user.email.includes(this.userEmail());
            return user;
          });
        }
      ))

  );

  /**
   * decode jwt and get the payload
   */
  ngOnInit(): void {
    this.token.set( this.authService.getCookieToken());
    if(this.token()){
      this.payload.set( this.jwtDecodeService.getPlayload(this.token()));
    }
  }

  /**
   * select the first index image's product by default
   * and switch on click
   */
  imageProduct: Signal<Image | undefined> = computed(() => {
    const prod:Product | undefined = this.product();
    if (!prod || !prod.images?.length) return undefined;
    return prod.images.find(img => img.id === this.idImage()) || prod.images[0];
  });




  destroy$ :DestroyRef = inject(DestroyRef);
  /**
   * add item to the cart
   */
  onAddItemToCart(productId: number ,quantity:number) {
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    const  user:User| undefined = this.currentUser();
    if(this.token() === '' ||  !user){
      this.router.navigate(['/signup']).then();
      return;
    }
    this.userEmail.set(this.payload()!.sub);
    const userId:number= user!.id;
    const cartItem: CartItem = this.form.value;
    this.cartSubscription = this.cartService.addItemToCart(productId,quantity,userId,cartItem)
      .subscribe({
        next: (value:ApiResponse) => {
          this.openSnackBar(value.message);
          this.router.navigate([`/products`]).then();
        },
        error:( err:HttpErrorResponse) => {
          const message:string = (err.error as  ErrorMessage).message;
          this.openSnackBar(message);
          this.form.reset();
        }
      });
    this.destroy$.onDestroy(()=>this.cartSubscription.unsubscribe());


  }

  //quantity value form control form
  get quantityValue():number {
    return Number(this.quantityControl.value);
  }

  /**
   * open snack
   */
  snackBar:MatSnackBar = inject(MatSnackBar);
  // show a flash  message
  openSnackBar(message:string){
    this.snackBar.openFromComponent(
      SnackBarComponent,
      {
        duration: 3000,
        data: message,
      }
    )
  }

  /**
   *  switch image dispositive on click  image
   * @param image
   */
  handleImageUpdate(image: Image) {
    this.idImage.set(image.id);
  }

  maxValueInventory:EffectRef =effect(()=> {
    const product = this.product();
    if (product) {
      this.maxInventory.set(product.inventory);
      this.quantityControl.setValidators([
        Validators.min(1),
        Validators.max(this.maxInventory())
      ]);
      this.quantityControl.updateValueAndValidity();
    }
  })

  /**
   * handle error message on quantity < 1 & max < quantity value
   */
  updateErrorQuantityMessage() {
    if (this.quantityControl.hasError('min')) {
      this.errorMessageQuantity.set('La quantité est requise');
    } else if (this.quantityControl.hasError('max')) {
      this.errorMessageQuantity.set(`La quantité doît inférieure ou également à la quantité en stock ${this.maxInventory()}`);
    }
  }




}

