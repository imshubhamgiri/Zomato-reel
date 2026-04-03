import { PipelineStage } from 'mongoose';
import Food from '../models/food.model';
import type { FoodItemWithStatus } from '../types';
import { Types } from 'mongoose';

const getFoodItemsWithUserState = async (
  userId?: string,
  limit: number = 2,
  id?: string,
  lastCreatedAt?: string
): Promise<{
  foods: FoodItemWithStatus[];
  total: number;
  nextCursor: { id: string; lastCreatedAt: string } | null;
  hasMore: boolean;

}> => {
  // CURSOR FILTER
  let cursorMatch: any = {};

  if (id && lastCreatedAt) {
    // Convert id string to ObjectId 
    const cursorId = new Types.ObjectId(id);
    
    // For cursor pagination: get docs with createdAt < lastCreatedAt
    // Also exclude the current doc by using _id comparison if timestamps are equal
    cursorMatch = {
      $or: [
        // Docs created before the cursor timestamp (older documents)
        { createdAt: { $lt: new Date(lastCreatedAt) } },
        // Docs created at the same time but with _id < cursor (in case of ties)
        {
          createdAt: new Date(lastCreatedAt),
          _id: { $lt: cursorId },
        },
      ],
    };
  } else if (lastCreatedAt) {
    cursorMatch = { createdAt: { $lt: new Date(lastCreatedAt) } };
  }

  // if (cursorMatch && Object.keys(cursorMatch).length > 0) {
  //   console.log('Cursor match:', JSON.stringify(cursorMatch, null, 2));
  // } else {
  //   console.log('No cursor filter applied - fetching from start');
  // }
  //  to detect if more results exist
  const fetchLimit = limit + 1;

  const pipeline: PipelineStage[] = [
    // 1️ FILTER by cursor
    { $match: cursorMatch },

    // 2️⃣ SORT - must match cursor field order for consistency
    { $sort: { createdAt: -1, _id: -1 } },

    // 3️ USE $FACET to get both data AND total count
    {
      $facet: {
        // BRANCH 1: Get paginated data with enrichment
        data: [
          { $limit: fetchLimit },

          // Get foodPartner details
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
              foodPartner: {
                name: '$foodPartnerData.name',
                _id: '$foodPartner',
              },
            },
          },
          {
            $project: {
              foodPartnerData: 0,
            },
          },
          
          // USER-SPECIFIC DATA if userId provided
          ...(userId
            ? [
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
                              { $eq: ['$userId', { $toObjectId: userId }] },
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
                              { $eq: ['$userId', { $toObjectId: userId }] },
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
                  },
                },
              ]
            : []),
        ],

        // BRANCH 2: Get total count (before pagination)
        totalCount: [{ $count: 'count' }],
      },
    },
  ];

  // Execute aggregation
  const result = await Food.aggregate<{
    data: FoodItemWithStatus[];
    totalCount: Array<{ count: number }>;
  }>(pipeline);

  //  RESULTS
  const foods = result[0]?.data || [];
  const total = result[0]?.totalCount[0]?.count || 0;

  //  IF MORE RESULTS EXIST
  const hasMore = foods.length > limit;
  const paginatedFoods = foods.slice(0, limit); // Return only limit items

  // CALCULATE NEXT CURSOR
  const lastItem = paginatedFoods[paginatedFoods.length - 1];
  const nextCursor = lastItem
    ? {
        id: (lastItem._id as any).toString(),
        lastCreatedAt: lastItem.createdAt.toISOString(),
      }
    : null;

  
  return {
    foods: paginatedFoods,
    total,
    nextCursor,
    hasMore,
  };
};

export default {
  getFoodItemsWithUserState,
};
