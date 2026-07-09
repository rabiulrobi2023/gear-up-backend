import { Prisma } from "../../../generated/prisma/client";

const buildSearchCondition = (
  searchTerm: string,
  searchableFields: string[],
): Prisma.ItemsWhereInput => {
  console.log(searchTerm);
  return {
    OR: searchableFields.map((field) => ({
      [field]: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
    })),
  };
};

export default buildSearchCondition;
