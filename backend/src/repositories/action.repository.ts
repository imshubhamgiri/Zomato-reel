import Like from '../models/like.model';
import Save from '../models/save.model';
import Food from '../models/food.model';

export const findLike = async (userId: string, foodId: string): Promise<any> => {
  return Like.findOne({ userId, food: foodId }).lean();
};

export const createLike = async (userId: string, foodId: string): Promise<any> => {
  return Like.create({ userId, food: foodId });
};

export const deleteLike = async (userId: string, foodId: string): Promise<any> => {
  return Like.deleteOne({ userId, food: foodId });
};

export const incrementLikeCount = async (foodId: string, amount: 1 | -1): Promise<any> => {
  return Food.findByIdAndUpdate(foodId, { $inc: { likeCount: amount } });
};

export const findSave = async (userId: string, foodId: string): Promise<any> => {
  return Save.findOne({ userId, food: foodId }).lean();
};

export const createSave = async (userId: string, foodId: string): Promise<any> => {
  return Save.create({ userId, food: foodId });
};

export const deleteSave = async (userId: string, foodId: string): Promise<any> => {
  return Save.deleteOne({ userId, food: foodId });
};

export const incrementSaveCount = async (foodId: string, amount: 1 | -1): Promise<any> => {
  return Food.findByIdAndUpdate(foodId, { $inc: { saveCount: amount } });
};
