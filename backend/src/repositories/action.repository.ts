import { ClientSession } from 'mongoose';
import Like from '../models/like.model';
import Save from '../models/save.model';
import Food from '../models/food.model';

export const findLike = async (userId: string, foodId: string, session?: ClientSession): Promise<any> => {
  return Like.findOne({ userId, food: foodId }).session(session || null).lean();
};

export const createLike = async (userId: string, foodId: string, session?: ClientSession): Promise<any> => {
  const [created] = await Like.create([{ userId, food: foodId }], { session });
  console.log('Created Like:', created);
  return created;
};

export const deleteLike = async (userId: string, foodId: string, session?: ClientSession): Promise<any> => {
  return Like.deleteOne({ userId, food: foodId }).session(session || null);
};

export const incrementLikeCount = async (foodId: string, amount: 1 | -1, session?: ClientSession): Promise<any> => {
  return Food.findByIdAndUpdate(foodId, { $inc: { likeCount: amount } }).session(session || null);
};

export const findSave = async (userId: string, foodId: string, session?: ClientSession): Promise<any> => {
  return Save.findOne({ userId, food: foodId }).session(session || null).lean();
};

export const createSave = async (userId: string, foodId: string, session?: ClientSession): Promise<any> => {
  const [created] = await Save.create([{ userId, food: foodId }], { session });
  return created;
};

export const deleteSave = async (userId: string, foodId: string, session?: ClientSession): Promise<any> => {
  return Save.deleteOne({ userId, food: foodId }).session(session || null);
};

export const incrementSaveCount = async (foodId: string, amount: 1 | -1, session?: ClientSession): Promise<any> => {
  return Food.findByIdAndUpdate(foodId, { $inc: { saveCount: amount } }).session(session || null);
};
