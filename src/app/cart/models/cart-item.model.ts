import {ProductPage} from '../../product/models/product.page.model';


export interface CartItem{
  id: number
  quantity: number
  unitPrice: number
  totalPrice: number
  //cart: Cart
  product: ProductPage
}

