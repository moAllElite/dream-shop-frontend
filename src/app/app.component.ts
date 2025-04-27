import {Component, DestroyRef, effect, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/components/navbar/navbar.component";
import {User} from './user/models/user.model';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {Cart} from './cart/models/cart.model';
import {UserService} from './security/services/user.service';
import {CartService} from './cart/services/cart.service';
import {AuthService} from './security/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'dream shop';
  authService:AuthService = inject(AuthService);
  userService:UserService = inject(UserService);
  cartService:CartService = inject(CartService);

  cart:WritableSignal<Cart| undefined> = signal(undefined);
  user:WritableSignal<User | undefined> = signal(undefined);
  destroyRef = inject(DestroyRef);
  countCartItems:WritableSignal<number> = signal(0);

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
  // getCartItemLength(isAuthenticated:boolean, users:User[]) {
  //   const user: User | undefined = this.getAuthenticatedUser(isAuthenticated, users);
  //   if (!user) {
  //    // this.message.set("Utilisateur non authentifié ou non trouvé");
  //   //  this.openSnackBar(this.message());
  //     return;
  //   }
  //    this.cartService.getCartByUserId(user.id).pipe(
  //      map((result: Cart) => {
  //       this.cart.set(result); // Évite undefined
  //       const counter:number |undefined = result?.items?.length;
  //       this.countCartItems.set(counter!);
  //       this.user.set(user);
  //     }));
  //   return this.cart;
  // }



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

}
