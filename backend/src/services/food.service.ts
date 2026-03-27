import type { FoodItemWithStatus } from '../types';
import foodRepository from '../repositories/food.repository';
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/error';
import food from '../models/food.model';

const getFoodItems = async (userId?: string): Promise<FoodItemWithStatus[]> => {
  return foodRepository.getFoodItemsWithUserState(userId);
};

const getFoodByPartnerId = async (partnerId: string): Promise<any[]> => {
  if (!partnerId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid partner ID format');
  }

  const foodItems = await food.find({ foodPartner: partnerId });
  return foodItems;
};

const deleteFoodItem = async (foodId: string, userId: string): Promise<void> => {
  if (!foodId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid food ID format');
  }

  const fooditem = await food.findById(foodId);

  if (!fooditem) {
    throw new NotFoundError('Food item not found');
  }

  if (fooditem.foodPartner.toString() !== userId) {
    throw new ForbiddenError('You can only delete your own food items');
  }
};

const checkFoodOwnership = async (foodId: string, userId: string): Promise<any> => {
  if (!foodId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid food ID format');
  }

  const fooditem = await food.findById(foodId);

  if (!fooditem) {
    throw new NotFoundError('Food item not found');
  }

  if (fooditem.foodPartner.toString() !== userId) {
    throw new ForbiddenError('You can only update your own food items');
  }

  return fooditem;
};

export default {
  getFoodItems,
  getFoodByPartnerId,
  deleteFoodItem,
  checkFoodOwnership,
};
