import { Request, Response } from 'express';
import { FoodPartner } from '../models/foodPartner.model';
import type { ApiResponse, ErrorResponse } from '../types';

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

    const foodPartner = await FoodPartner.findById(id).lean();
    if (!foodPartner) {
      res.status(404).json({ success: false, message: 'Food Partner not found', error: 'Not found' });
      return;
    }

    const response: ProfileResponse = {
      name: foodPartner.name,
      restaurantName: foodPartner.restaurantName,
      email: foodPartner.email,
      phone: foodPartner.phone,
      address: foodPartner.address,
    };

    res.status(200).json({ success: true, message: 'Profile retrieved successfully', data: response });
  } catch (error) {
    console.error('Error fetching food partner profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
