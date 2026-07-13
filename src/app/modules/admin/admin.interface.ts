import { UserStatus } from "../../../../generated/prisma/enums";
import { UserWhereInput } from "../../../../generated/prisma/models";

export interface ICreateCategory {
  name: string;
}

export interface IUpdateUserStatus {
  status: UserStatus;
}

export interface IUserWhereInput extends UserWhereInput {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}



