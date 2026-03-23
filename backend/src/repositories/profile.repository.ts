import { FoodPartner } from '../models/foodPartner.model';

const getFoodPartnerById = (id: string) => {
  return FoodPartner.findById(id).lean();
};

export default {
  getFoodPartnerById,
};
