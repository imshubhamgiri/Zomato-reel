import profileRepository from '../repositories/profile.repository';

interface PartnerProfile {
  name: string;
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
}

const getFoodPartnerProfile = async (id: string): Promise<PartnerProfile | null> => {
  const foodPartner = await profileRepository.getFoodPartnerById(id);
  if (!foodPartner) {
    return null;
  }

  return {
    name: foodPartner.name,
    restaurantName: foodPartner.restaurantName,
    email: foodPartner.email,
    phone: foodPartner.phone,
    address: foodPartner.address,
  };
};

export default {
  getFoodPartnerProfile,
};
