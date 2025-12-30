import { Request, Response } from 'express';
import { FoodPartner } from '../models/foodPartner.model';

interface ProfileResponse {
  name: string;
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
}

interface ErrorResponse {
  message: string;
  error?: string | object;
}

export const getFoodPartnerProfile = async (
  req: Request,
  res: Response<ProfileResponse | ErrorResponse>
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'Invalid partner ID format' });
      return;
    }

    const foodPartner = await FoodPartner.findById(id).lean();
    if (!foodPartner) {
      res.status(404).json({ message: 'Food Partner not found' });
      return;
    }

    // Return only necessary fields (security best practice)
    const response: ProfileResponse = {
      name: foodPartner.name,
      restaurantName: foodPartner.restaurantName,
      email: foodPartner.email,
      phone: foodPartner.phone,
      address: foodPartner.address,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching food partner profile:', error);
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
