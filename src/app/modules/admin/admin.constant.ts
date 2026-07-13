import { Role, UserStatus } from "../../../../generated/prisma/enums";
import { ISearchableEnumFields } from "../../utils/buildSearchCondition";

export const userSearchableFields = ["name", "email", "address"];
export const userSearchableEnumAndNumericField: ISearchableEnumFields[] = [
  {
    field: "role",
    values: Object.values(Role),
  },
  {
    field: "status",
    values: Object.values(UserStatus),
  },
];
