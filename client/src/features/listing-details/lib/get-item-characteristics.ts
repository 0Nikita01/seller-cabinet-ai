import type {
  AutoItemDetails,
  ElectronicsItemDetails,
  ItemCharacteristic,
  ItemDetails,
  RealEstateItemDetails,
} from '../model/listing-details.types';

const AUTO_TRANSMISSION_LABELS = {
  automatic: 'Автомат',
  manual: 'Механика',
} as const;

const REAL_ESTATE_TYPE_LABELS = {
  flat: 'Квартира',
  house: 'Дом',
  room: 'Комната',
} as const;

const ELECTRONICS_TYPE_LABELS = {
  phone: 'Телефон',
  laptop: 'Ноутбук',
  misc: 'Другое',
} as const;

const ELECTRONICS_CONDITION_LABELS = {
  new: 'Новый',
  used: 'Б/у',
} as const;

const getAutoCharacteristics = (item: AutoItemDetails): ItemCharacteristic[] => {
  const { params } = item;

  return [
    params.brand ? { label: 'Бренд', value: params.brand } : null,
    params.model ? { label: 'Модель', value: params.model } : null,
    params.yearOfManufacture
      ? { label: 'Год выпуска', value: String(params.yearOfManufacture) }
      : null,
    params.transmission
      ? {
          label: 'Коробка передач',
          value: AUTO_TRANSMISSION_LABELS[params.transmission],
        }
      : null,
    params.mileage ? { label: 'Пробег', value: `${params.mileage} км` } : null,
    params.enginePower
      ? { label: 'Мощность двигателя', value: `${params.enginePower} л.с.` }
      : null,
  ].filter(Boolean) as ItemCharacteristic[];
};

const getRealEstateCharacteristics = (item: RealEstateItemDetails): ItemCharacteristic[] => {
  const { params } = item;

  return [
    params.type ? { label: 'Тип', value: REAL_ESTATE_TYPE_LABELS[params.type] } : null,
    params.address ? { label: 'Адрес', value: params.address } : null,
    params.area ? { label: 'Площадь', value: `${params.area} м²` } : null,
    params.floor ? { label: 'Этаж', value: String(params.floor) } : null,
  ].filter(Boolean) as ItemCharacteristic[];
};

const getElectronicsCharacteristics = (item: ElectronicsItemDetails): ItemCharacteristic[] => {
  const { params } = item;

  return [
    params.type ? { label: 'Тип', value: ELECTRONICS_TYPE_LABELS[params.type] } : null,
    params.brand ? { label: 'Бренд', value: params.brand } : null,
    params.model ? { label: 'Модель', value: params.model } : null,
    params.condition
      ? { label: 'Состояние', value: ELECTRONICS_CONDITION_LABELS[params.condition] }
      : null,
    params.color ? { label: 'Цвет', value: params.color } : null,
  ].filter(Boolean) as ItemCharacteristic[];
};

export const getItemCharacteristics = (item: ItemDetails): ItemCharacteristic[] => {
  switch (item.category) {
    case 'auto':
      return getAutoCharacteristics(item);

    case 'real_estate':
      return getRealEstateCharacteristics(item);

    case 'electronics':
      return getElectronicsCharacteristics(item);

    default:
      return [];
  }
};
