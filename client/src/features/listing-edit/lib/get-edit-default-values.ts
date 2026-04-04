import type { ItemDetails } from '../../listing-details/model/listing-details.types';
import type { ListingEditFormValues } from '../model/listing-edit.types';

export const getEditDefaultValues = (item: ItemDetails): ListingEditFormValues => {
  const baseValues: ListingEditFormValues = {
    category: item.category,
    title: item.title ?? '',
    price: String(item.price ?? ''),
    description: item.description ?? '',
    params: {
      brand: '',
      model: '',
      yearOfManufacture: '',
      transmission: '',
      mileage: '',
      enginePower: '',
      type: '',
      address: '',
      area: '',
      floor: '',
      condition: '',
      color: '',
    },
  };

  switch (item.category) {
    case 'auto':
      return {
        ...baseValues,
        params: {
          ...baseValues.params,
          brand: item.params.brand ?? '',
          model: item.params.model ?? '',
          yearOfManufacture: item.params.yearOfManufacture
            ? String(item.params.yearOfManufacture)
            : '',
          transmission: item.params.transmission ?? '',
          mileage: item.params.mileage ? String(item.params.mileage) : '',
          enginePower: item.params.enginePower ? String(item.params.enginePower) : '',
        },
      };

    case 'real_estate':
      return {
        ...baseValues,
        params: {
          ...baseValues.params,
          type: item.params.type ?? '',
          address: item.params.address ?? '',
          area: item.params.area ? String(item.params.area) : '',
          floor: item.params.floor ? String(item.params.floor) : '',
        },
      };

    case 'electronics':
      return {
        ...baseValues,
        params: {
          ...baseValues.params,
          type: item.params.type ?? '',
          brand: item.params.brand ?? '',
          model: item.params.model ?? '',
          condition: item.params.condition ?? '',
          color: item.params.color ?? '',
        },
      };

    default:
      return baseValues;
  }
};
