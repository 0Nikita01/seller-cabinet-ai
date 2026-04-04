import type { ListingEditFormValues, ListingEditRequestBody } from '../model/listing-edit.types';

const toOptionalString = (value: string) => {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
};

const toOptionalNumber = (value: string) => {
  const trimmedValue = value.trim();
  return trimmedValue ? Number(trimmedValue) : undefined;
};

export const mapFormValuesToRequest = (values: ListingEditFormValues): ListingEditRequestBody => {
  const commonFields = {
    category: values.category,
    title: values.title.trim(),
    description: toOptionalString(values.description),
    price: Number(values.price),
  };

  switch (values.category) {
    case 'auto':
      return {
        ...commonFields,
        category: 'auto',
        params: {
          brand: toOptionalString(values.params.brand),
          model: toOptionalString(values.params.model),
          yearOfManufacture: toOptionalNumber(values.params.yearOfManufacture),
          transmission: values.params.transmission || undefined,
          mileage: toOptionalNumber(values.params.mileage),
          enginePower: toOptionalNumber(values.params.enginePower),
        },
      };

    case 'real_estate':
      return {
        ...commonFields,
        category: 'real_estate',
        params: {
          type: values.params.type as 'flat' | 'house' | 'room' | undefined,
          address: toOptionalString(values.params.address),
          area: toOptionalNumber(values.params.area),
          floor: toOptionalNumber(values.params.floor),
        },
      };

    case 'electronics':
      return {
        ...commonFields,
        category: 'electronics',
        params: {
          type: values.params.type as 'phone' | 'laptop' | 'misc' | undefined,
          brand: toOptionalString(values.params.brand),
          model: toOptionalString(values.params.model),
          condition: values.params.condition || undefined,
          color: toOptionalString(values.params.color),
        },
      };

    default:
      return {
        ...commonFields,
        category: 'electronics',
        params: {},
      };
  }
};
