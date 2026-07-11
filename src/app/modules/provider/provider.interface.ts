export interface IAddItem {
  name: string;
  brand?: string;
  description?: string;
  image?: string;
  categoryId: string;
  dailyRate: number;
  stock: number;
  isAvailable?: boolean;
}
