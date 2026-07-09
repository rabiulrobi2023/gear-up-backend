import { ItemsWhereInput } from "../../../../generated/prisma/models";

export interface IItemQueryInput extends ItemsWhereInput {

  searchTerm?: string;
  categoryName?:string
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}
