import { PipelineStage } from 'mongoose';
import Food from '../models/food.model';
import type { FoodItemWithStatus } from '../types';

const getFoodItemsWithUserState = async (userId?: string): Promise<FoodItemWithStatus[]> => {
  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: 'foodpartners',
        localField: 'foodPartner',
        foreignField: '_id',
        as: 'foodPartnerData',
      },
    },
    {
      $unwind: {
        path: '$foodPartnerData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        foodPartner: { name: '$foodPartnerData.name', _id: '$foodPartner' },
      },
    },
  ];

  if (userId) {
    pipeline.push(
      {
        $lookup: {
          from: 'likes',
          let: { foodId: '$_id', userId },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$food', '$$foodId'] },
                    { $eq: ['$userId', { $toObjectId: '$$userId' }] },
                  ],
                },
              },
            },
          ],
          as: 'userLikeData',
        },
      },
      {
        $lookup: {
          from: 'saves',
          let: { foodId: '$_id', userId },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$food', '$$foodId'] },
                    { $eq: ['$userId', { $toObjectId: '$$userId' }] },
                  ],
                },
              },
            },
          ],
          as: 'userSaveData',
        },
      },
      {
        $addFields: {
          isLiked: { $gt: [{ $size: '$userLikeData' }, 0] },
          isSaved: { $gt: [{ $size: '$userSaveData' }, 0] },
        },
      },
      {
        $project: {
          userLikeData: 0,
          userSaveData: 0,
          foodPartnerData: 0,
        },
      }
    );
  } else {
    pipeline.push({
      $project: {
        foodPartnerData: 0,
      },
    });
  }

  return Food.aggregate<FoodItemWithStatus>(pipeline);
};

export default {
  getFoodItemsWithUserState,
};
