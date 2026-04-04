import type {
  AutoTransmission,
  ElectronicsCondition,
  ElectronicsType,
  ItemCategory,
  RealEstateType,
} from '../../listing-details/model/listing-details.types';

export type ListingEditFormValues = {
  category: ItemCategory;
  title: string;
  price: string;
  description: string;
  params: {
    brand: string;
    model: string;
    yearOfManufacture: string;
    transmission: AutoTransmission | '';
    mileage: string;
    enginePower: string;
    type: RealEstateType | ElectronicsType | '';
    address: string;
    area: string;
    floor: string;
    condition: ElectronicsCondition | '';
    color: string;
  };
};

export type ListingEditRequestBody =
  | {
      category: 'auto';
      title: string;
      description?: string;
      price: number;
      params: {
        brand?: string;
        model?: string;
        yearOfManufacture?: number;
        transmission?: AutoTransmission;
        mileage?: number;
        enginePower?: number;
      };
    }
  | {
      category: 'real_estate';
      title: string;
      description?: string;
      price: number;
      params: {
        type?: RealEstateType;
        address?: string;
        area?: number;
        floor?: number;
      };
    }
  | {
      category: 'electronics';
      title: string;
      description?: string;
      price: number;
      params: {
        type?: ElectronicsType;
        brand?: string;
        model?: string;
        condition?: ElectronicsCondition;
        color?: string;
      };
    };
