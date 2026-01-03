import {  Response } from 'express';
import type { ApiResponse, ErrorResponse, AuthenticatedRequest } from '../types';
import likeModel from '../models/like.model';
import save from '../models/save.model';
import foodModel from '../models/food.model';

interface LikeResponse {
  id: string;
  userId: string;
  food: string;
}

interface SaveResponse {
  id: string;
  userId: string;
  foodId: string;
}

export const likefood = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<LikeResponse> | ErrorResponse>
): Promise<void> => {
  try {
    const { foodId } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
        error: 'User not authenticated',
      });
      return;
    }

    const isAlreadyLiked = await likeModel.findOne({
      userId: user.id,
      food: foodId,
    });

    if (isAlreadyLiked) {
      await likeModel.deleteOne({
        userId: user.id,
        food: foodId,
      });

      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 },
      });

      res.status(200).json({
        success: true,
        message: 'Food unliked successfully',
      });
      return;
    }

    const like = await likeModel.create({
      userId: user.id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { likeCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Food liked successfully',
      user: {
        id: like._id.toString(),
        userId: like.userId.toString(),
        food: like.food.toString(),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error liking the foodreel',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const saveFood = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<SaveResponse> | ErrorResponse>
): Promise<void> => {
  const { foodId } = req.body;
  const user = req.user;

  try {
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
        error: 'User not authenticated',
      });
      return;
    }

    // checking saved already or not
    const isSaved = await save.findOne({
      userId: user.id,
      food: foodId,
    });

    if (isSaved) {
      await save.deleteOne({
        userId: user.id,
        food: foodId,
      });

      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { saveCount: -1 },
      });

      res.status(200).json({
        success: true,
        message: 'Removed from saved',
      });
      return;
    }

    const saveFood = await save.create({
      userId: user.id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { saveCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Food saved successfully',
      user: {
        id: saveFood._id.toString(),
        userId: saveFood.userId.toString(),
        foodId: saveFood.food.toString(),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error saving the foodreel',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};