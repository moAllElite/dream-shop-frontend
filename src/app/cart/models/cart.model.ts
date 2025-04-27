import {User} from  '../../user/models/user.model';
import {CartItem} from './cart-item.model';

export interface Cart {
  id?: number;
  totalAmount?: number;
  items?: CartItem[];
  user?: User;
}
