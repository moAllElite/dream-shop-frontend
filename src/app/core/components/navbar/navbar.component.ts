import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule,MatIconModule,MatListModule,RouterLink],
  standalone:true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {


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
    }
  ]
}
