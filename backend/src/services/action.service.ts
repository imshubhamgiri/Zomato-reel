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
  const existing = await findLike(userId, foodId);

  if (existing) {
    await deleteLike(userId, foodId);
    await incrementLikeCount(foodId, -1);
    return { toggled: 'off' };
  }

  const created = await createLike(userId, foodId);
  await incrementLikeCount(foodId, 1);

  return {
    toggled: 'on',
    entity: {
      id: created._id.toString(),
      userId: created.userId.toString(),
      foodId: created.food.toString(),
    },
  };
};

const toggleSave = async (userId: string, foodId: string): Promise<ToggleResult> => {
  const existing = await findSave(userId, foodId);

  if (existing) {
    await deleteSave(userId, foodId);
    await incrementSaveCount(foodId, -1);
    return { toggled: 'off' };
  }

  const created = await createSave(userId, foodId);
  await incrementSaveCount(foodId, 1);

  return {
    toggled: 'on',
    entity: {
      id: created._id.toString(),
      userId: created.userId.toString(),
      foodId: created.food.toString(),
    },
  };
};

export default {
  toggleLike,
  toggleSave,
};
