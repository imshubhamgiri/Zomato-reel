import { Response } from 'express';
import type { ApiResponse, ErrorResponse, AuthenticatedRequest } from '../types';
import actionService from '../services/action.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthError } from '../utils/error';

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

export const likefood = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<LikeResponse> | ErrorResponse>
  ): Promise<void> => {
    const { foodId } = req.body;
    const user = req.user;

    if (!user) {
      throw new AuthError('User not authenticated');
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
  }
);

export const saveFood = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<SaveResponse> | ErrorResponse>
  ): Promise<void> => {
    const { foodId } = req.body;
    const user = req.user;

    if (!user) {
      throw new AuthError('User not authenticated');
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
  }
);