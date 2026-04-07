import mongoose from 'mongoose';
import {
  createLike,
  createSave,
  deleteLike,
  deleteSave,
  findLike,
  findSave,
  incrementLikeCount,
  incrementSaveCount,
} from '../repositories/action.repository';

interface ToggleResult {
  toggled: 'on' | 'off';
  entity?: {
    id: string;
    userId: string;
    foodId: string;
  };
}

const toggleLike = async (userId: string, foodId: string): Promise<ToggleResult> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await findLike(userId, foodId, session);

    if (existing) {
      await deleteLike(userId, foodId, session);
      await incrementLikeCount(foodId, -1, session);
      await session.commitTransaction();
      return { toggled: 'off' };
    }

    const created = await createLike(userId, foodId, session);
    await incrementLikeCount(foodId, 1, session);

    await session.commitTransaction();
    return {
      toggled: 'on',
      entity: {
        id: created._id.toString(),
        userId: created.userId.toString(),
        foodId: created.food.toString(),
      },
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const toggleSave = async (userId: string, foodId: string): Promise<ToggleResult> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await findSave(userId, foodId, session);

    if (existing) {
      await deleteSave(userId, foodId, session);
      await incrementSaveCount(foodId, -1, session);
      await session.commitTransaction();
      return { toggled: 'off' };
    }

    const created = await createSave(userId, foodId, session);
    await incrementSaveCount(foodId, 1, session);

    await session.commitTransaction();
    return {
      toggled: 'on',
      entity: {
        id: created._id.toString(),
        userId: created.userId.toString(),
        foodId: created.food.toString(),
      },
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export default {
  toggleLike,
  toggleSave,
};
