import { ItemsWhereInput } from "../../../../generated/prisma/models";

export interface IItemQueryInput extends ItemsWhereInput {
  searchTerm?: string;
  categoryName?: string;
  minRate?: string;
  maxRate?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}
