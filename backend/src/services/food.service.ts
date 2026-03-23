import type { FoodItemWithStatus } from '../types';
import foodRepository from '../repositories/food.repository';

const getFoodItems = async (userId?: string): Promise<FoodItemWithStatus[]> => {
  return foodRepository.getFoodItemsWithUserState(userId);
};

export default {
  getFoodItems,
};
