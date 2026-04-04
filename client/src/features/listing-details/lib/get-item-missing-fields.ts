import type { ItemDetails } from '../model/listing-details.types';

const isEmptyString = (value?: string) => !value || !value.trim();

export const getItemMissingFields = (item: ItemDetails): string[] => {
  const missingFields: string[] = [];

  if (isEmptyString(item.description)) {
    missingFields.push('Описание');
  }

  switch (item.category) {
    case 'auto': {
      const { params } = item;

      if (isEmptyString(params.brand)) missingFields.push('Бренд');
      if (isEmptyString(params.model)) missingFields.push('Модель');
      if (!params.yearOfManufacture) missingFields.push('Год выпуска');
      if (!params.transmission) missingFields.push('Коробка передач');
      if (!params.mileage) missingFields.push('Пробег');
      if (!params.enginePower) missingFields.push('Мощность двигателя');

      break;
    }

    case 'real_estate': {
      const { params } = item;

      if (!params.type) missingFields.push('Тип');
      if (isEmptyString(params.address)) missingFields.push('Адрес');
      if (!params.area) missingFields.push('Площадь');
      if (!params.floor) missingFields.push('Этаж');

      break;
    }

    case 'electronics': {
      const { params } = item;

      if (!params.type) missingFields.push('Тип');
      if (isEmptyString(params.brand)) missingFields.push('Бренд');
      if (isEmptyString(params.model)) missingFields.push('Модель');
      if (!params.condition) missingFields.push('Состояние');
      if (isEmptyString(params.color)) missingFields.push('Цвет');

      break;
    }
  }

  return missingFields;
};
