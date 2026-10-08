import { Role, UserStatus } from "../../../../generated/prisma/enums";
import { ISearchableEnumField } from "../../utils/buildSearchCondition";

export const userSearchableFields = ["name", "email", "address"];
export const userSearchableEnumAndNumericField: ISearchableEnumField[] = [
  {
    field: "role",
    values: Object.values(Role),
  },
  {
    field: "status",
    values: Object.values(UserStatus),
  },
];
