import { Response } from 'express';
import type { ApiResponse, AuthenticatedRequest, ErrorResponse } from '../types';
import profileService from '../services/profile.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthError } from '../utils/error';

interface ProfileResponse {
  name: string;
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
}

interface PublicProfileResponse {
  name: string;
  restaurantName: string;
  address: string;
}

export const getFoodPartnerProfile = asyncHandler(
  async (
    req:AuthenticatedRequest,
    res: Response<ApiResponse<ProfileResponse> | ErrorResponse>
  ): Promise<void> => {
    const user = req.user;
     if (!user) {
          throw new AuthError('User not authenticated');
        }
    
    // Service handles validation and throws errors if invalid
    const profile = await profileService.getFoodPartnerProfile(user.id);
    
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile as ProfileResponse
    });
  }
);

export const getPublicFoodPartnerProfile = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse<PublicProfileResponse> | ErrorResponse>
  ): Promise<void> => {
    const { id } = req.params as { id: string };

    const profile = await profileService.getPublicFoodPartnerProfile(id);

    res.status(200).json({
      success: true,
      message: 'Public partner profile retrieved successfully',
      data: profile as PublicProfileResponse,
    });
  }
);
