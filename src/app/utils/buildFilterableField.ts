import { IItemQueryInput } from "../modules/public/public.interface";

const buildFilterableField = (
  queryFilter: IItemQueryInput,
  filterableFields: string[],
) => {
  return {
    AND: Object.entries(queryFilter)
      .filter(
        ([key, value]) =>
          filterableFields.includes(key) &&
          value !== undefined &&
          value !== null &&
          value !== "",
      )
      .map(([key, value]) => ({ [key]: value })),
  };
};

export default buildFilterableField;