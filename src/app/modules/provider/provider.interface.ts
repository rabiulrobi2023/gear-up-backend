import { OrderStatus } from "../../../../generated/prisma/enums";

export interface IAddItem {
  name: string;
  brand?: string;
  description?: string;
  image?: string;
  categoryId: string;
  dailyRate: number;
  stock: number;
}

export interface IUpdateItem {
  name?: string;
  brand?: string;
  description?: string;
  image?: string;
  categoryId?: string;
  dailyRate?: number;
  stock?: number;
}

export interface IUpdateOrderStatus {
  status?: OrderStatus;
}
