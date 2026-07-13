import { Prisma } from "../../../generated/prisma/client";

export interface ISearchableEnumFields {
  field: string;
  values: readonly string[];
}
const buildSearchCondition = <T>(
  searchTerm: string,
  searchableFields: string[],
  enumAndNumericFields: ISearchableEnumFields[] = [],
): T => {
  const OR: Record<string, unknown>[] = [];

  searchableFields.forEach((field) =>
    OR.push({
      [field]: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
    }),
  );

  const normalizedSearch = searchTerm.toUpperCase();

  enumAndNumericFields.forEach(({ field, values }) => {
    if (values.includes(normalizedSearch)) {
      OR.push({ [field]: { equals: normalizedSearch } });
    }
  });

  return {
    OR,
  } as T;
};

export default buildSearchCondition;
