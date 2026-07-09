export interface IAddItem {
  name: string;
  brand?: string;
  description?: string;
  images?: string;
  categoryId: string;
  price: number;
  stock: number;
  isAvailable?: boolean;
}
