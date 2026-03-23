import {  Response } from 'express';
import type { ApiResponse, ErrorResponse, AuthenticatedRequest } from '../types';
import actionService from '../services/action.service';

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

    const result = await actionService.toggleLike(user.id, foodId);

    if (result.toggled === 'off') {
      res.status(200).json({
        success: true,
        message: 'Food unliked successfully',
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Food liked successfully',
      user: {
        id: result.entity!.id,
        userId: result.entity!.userId,
        food: result.entity!.foodId,
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

    const result = await actionService.toggleSave(user.id, foodId);

    if (result.toggled === 'off') {
      res.status(200).json({
        success: true,
        message: 'Removed from saved',
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Food saved successfully',
      user: {
        id: result.entity!.id,
        userId: result.entity!.userId,
        foodId: result.entity!.foodId,
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