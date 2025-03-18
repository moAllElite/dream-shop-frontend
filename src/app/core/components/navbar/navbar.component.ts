import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatMenuModule,
    CommonModule, MatButtonModule, MatIconModule,
    MatListModule, RouterLink, TitleCasePipe],
  standalone:true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  themeService:ThemeService = inject(ThemeService); //inject the theme in order to switch between light &dark mode
  authService:AuthService = inject(AuthService); // inject authentification service
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

  isAuthenticated():boolean{
    return !!this.authService.getCookieToken();
  };

  logout() {
    this.authService.destroyCookieToken();
  }
}
