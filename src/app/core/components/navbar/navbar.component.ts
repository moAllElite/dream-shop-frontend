import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule,MatMenuModule,MatButtonModule,MatIconModule,MatListModule,RouterLink],
  standalone:true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  themeService:ThemeService = inject(ThemeService);

  navItem =[
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
}
