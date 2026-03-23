import { Request, Response } from 'express';
import type { ApiResponse, ErrorResponse } from '../types';
import profileService from '../services/profile.service';

interface ProfileResponse {
  name: string;
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
}

export const getFoodPartnerProfile = async (
  req: Request,
  res: Response<ApiResponse<ProfileResponse> | ErrorResponse>
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ success: false, message: 'Invalid partner ID format', error: 'Invalid ID format' });
      return;
    }

    const profile = await profileService.getFoodPartnerProfile(id);
    if (!profile) {
      res.status(404).json({ success: false, message: 'Food Partner not found', error: 'Not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Profile retrieved successfully', data: profile as ProfileResponse });
  } catch (error) {
    console.error('Error fetching food partner profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
