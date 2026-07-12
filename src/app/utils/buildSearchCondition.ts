import { Prisma } from "../../../generated/prisma/client";

const buildSearchCondition = <T>(
  searchTerm: string,
  searchableFields: string[],
): T => {
  return {
    OR: searchableFields.map((field) => ({
      [field]: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
    })),
  } as T;
};

export default buildSearchCondition;
