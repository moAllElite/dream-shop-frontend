import { Category } from "./category"
import { Image } from "./image"
export interface Product {
    id: number
    name: string
    description: string
    price: number
    inventory: string
    brand: string
    category: Category
    images: Image[]
  }


