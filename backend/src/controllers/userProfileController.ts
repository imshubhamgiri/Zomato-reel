import { Response } from 'express';
import type { ApiResponse, ErrorResponse, AuthenticatedRequest } from '../types';
import { getUserProfile as userProfileService  } from '../services/userProfile.service';
import * as userProfileRepository from '../repositories/userProfile.repository';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthError } from '../utils/error'; 

interface updateUserProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
}

interface userProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    gender?: 'Male' | 'Female' | 'Other';
}

export const getUserProfile = asyncHandler
( async (req: AuthenticatedRequest, res: Response<ApiResponse<userProfile> | ErrorResponse>): Promise<void> => {
    const user = req.user;
    if (!user) {
      throw new AuthError('User not authenticated');
    }
    const profile = await userProfileService(user.id);
    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: profile,
    });
  }
);

export const updateUserProfile = asyncHandler(async(req: AuthenticatedRequest & { body: updateUserProfileRequest }, res: Response<ApiResponse<userProfile> | ErrorResponse>): Promise<void> => {
  const user = req.user;
  if (!user) {
    throw new AuthError('User not authenticated');
  }

  const update = await userProfileRepository.updateUserProfile(user.id, req.body);
  if (!update) {
    res.status(404).json({
      success: false,
      message: 'User profile not found',
    });
    return;
  }
    res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data:{
            id: user.id,
            ...update  
        }
    });
            
  // Implementation for updating user profile
});