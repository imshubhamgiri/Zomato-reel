import { Request, Response } from 'express';
import type { ApiResponse, ErrorResponse } from '../types';
import profileService from '../services/profile.service';
import { asyncHandler } from '../utils/asyncHandler';

interface ProfileResponse {
  name: string;
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
}

export const getFoodPartnerProfile = asyncHandler(
  async (
    req: Request,
    res: Response<ApiResponse<ProfileResponse> | ErrorResponse>
  ): Promise<void> => {
    const { id } = req.params;
    
    // Service handles validation and throws errors if invalid
    const profile = await profileService.getFoodPartnerProfile(id);
    
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile as ProfileResponse
    });
  }
);
