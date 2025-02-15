import { Category } from "../../category/models/category.model"
import { Image } from "./image.model"
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


