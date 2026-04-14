import profileRepository from '../repositories/profile.repository';
import { NotFoundError, ValidationError } from '../utils/error';

interface PartnerProfile {
  name: string;
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
}

interface PublicPartnerProfile {
  name: string;
  restaurantName: string;
  address: string;
}

const getFoodPartnerProfile = async (id: string): Promise<PartnerProfile> => {
  // Validate ID format before querying database
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid partner ID format');
  }

  const foodPartner = await profileRepository.getFoodPartnerById(id);
  
  // Throw error instead of returning null
  if (!foodPartner) {
    throw new NotFoundError('Food Partner not found');
  }

  return {
    name: foodPartner.name,
    restaurantName: foodPartner.restaurantName,
    email: foodPartner.email,
    phone: foodPartner.phone,
    address: foodPartner.address,
  };
};

const getPublicFoodPartnerProfile = async (id: string): Promise<PublicPartnerProfile> => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid partner ID format');
  }

  const foodPartner = await profileRepository.getFoodPartnerById(id);

  if (!foodPartner) {
    throw new NotFoundError('Food Partner not found');
  }

  return {
    name: foodPartner.name,
    restaurantName: foodPartner.restaurantName,
    address: foodPartner.address,
  };
};

export default {
  getFoodPartnerProfile,
  getPublicFoodPartnerProfile,
};
