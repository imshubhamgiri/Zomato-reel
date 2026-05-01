import { Response } from 'express';
import type { ApiResponse, ErrorResponse, AuthenticatedRequest, UserAddress, UserProfile, SavedFood } from '../types';
import * as userProfileService from '../services/userProfile.service'
import { asyncHandler } from '../utils/asyncHandler';
import { AuthError } from '../utils/error'; 

interface updateUserProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
}

// Re-export for easier usage in this controller
interface UserAddressInput {
  label?: 'Home' | 'Work' | 'Other';
  fullName?: string;
  phone?: string;
  locality?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  landmark?: string;
  alternatePhone?: string;
  isDefault?: boolean;
}

const getAddressIdParam = (raw: string | string[] | undefined): string => {
  if (Array.isArray(raw)) {
    return raw[0] ?? '';
  }
  return raw ?? '';
};

export const getUserProfile = asyncHandler
( async (req: AuthenticatedRequest, res: Response<ApiResponse<UserProfile> | ErrorResponse>): Promise<void> => {
    const user = req.user;
    if (!user) {
      throw new AuthError('User not authenticated');
    }
    const profile = await userProfileService.getUserProfile(user.id);
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

export const updateUserProfile = asyncHandler(async(req: AuthenticatedRequest & { body: updateUserProfileRequest }, res: Response<ApiResponse<UserProfile> | ErrorResponse>): Promise<void> => {
  const user = req.user;
  if (!user) {
    throw new AuthError('User not authenticated');
  }

  const update = await userProfileService.updateUserProfile(user.id, req.body);
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
            name: update.name,
            email: update.email,
            phone: update.phone,
            gender: update.gender
        }
    });
            
  // Implementation for updating user profile
});


export const addUserAddress = asyncHandler(async(req: AuthenticatedRequest & { body: UserAddressInput }, res: Response<ApiResponse<UserAddress> | ErrorResponse>): Promise<void> => {
  const user = req.user;
  if (!user) {
    throw new AuthError('User not authenticated');
  }

  const address = await userProfileService.addAddress(user.id, req.body);
  if (!address) {
    res.status(404).json({
      success: false,
      message: 'User profile not found',
    });
    return;
  }
    res.status(201).location(`/api/users/me/addresses/${address._id}`)
    .json({
        success: true,
        message: 'Address added successfully',
        data: address
    });
});

export const getUserAddresses = asyncHandler(async(req: AuthenticatedRequest, res: Response<ApiResponse<UserAddress[]> | ErrorResponse>): Promise<void> => {
  const user = req.user;
  if (!user) {
    throw new AuthError('User not authenticated');
  }

  const addresses = await userProfileService.getUserAddresses(user.id);
  if (!addresses) {
    res.status(404).json({
      success: false,
      message: 'User profile not found',
    });
    return;
  }
    res.status(200).json({
        success: true,
        message: 'Addresses fetched successfully',
        data: addresses
    });
});

export const deleteUserAddress = asyncHandler(async(req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    throw new AuthError('User not authenticated');
  }
  const addressId = getAddressIdParam((req.params as { addressId?: string | string[] }).addressId);
  if (!addressId) {
    res.status(400).json({
      success: false,
      message: 'Address ID is required',
    });
    return;
  }
  await userProfileService.deleteUserAddress(user.id, addressId);
  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
  });
});

export const updateUserAddress = asyncHandler(async(req: AuthenticatedRequest & { body: UserAddressInput }, res: Response<ApiResponse<UserAddress> | ErrorResponse>): Promise<void> => {
  const user = req.user;
  if (!user) {
    throw new AuthError('User not authenticated');
  }
  const addressId = getAddressIdParam((req.params as { addressId?: string | string[] }).addressId);
  if (!addressId) {
    res.status(400).json({
      success: false,
      message: 'Address ID is required',
    });
    return;
  }
  
  const updatedAddress = await userProfileService.updateAddress(user.id, addressId, req.body);
  if (!updatedAddress) {
    res.status(404).json({
      success: false,
      message: 'Address not found',
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: updatedAddress
  });
});

export const setDefaultAddress = asyncHandler(async(req: AuthenticatedRequest, res: Response<ApiResponse<UserAddress> | ErrorResponse>): Promise<void> => {
  const user = req.user;
  if (!user) {
    throw new AuthError('User not authenticated');
  }
  const addressId = getAddressIdParam((req.params as { addressId?: string | string[] }).addressId);
  if (!addressId) {
    res.status(400).json({
      success: false,
      message: 'Address ID is required',
    });
    return;
  }
  
  const updatedAddress = await userProfileService.setDefaultAddress(user.id, addressId);
  if (!updatedAddress) {
    res.status(404).json({
      success: false,
      message: 'Address not found',
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: 'Address set as default successfully',
    data: updatedAddress
  });
});

export const getUserSavedFoods = asyncHandler(async(req: AuthenticatedRequest, res: Response<ApiResponse<SavedFood[]> | ErrorResponse>): Promise<void> => {
  const user = req.user;
  if (!user) {
    throw new AuthError('User not authenticated');
  }

  const savedFoods = await userProfileService.getSavedFoods(user.id);
  res.status(200).json({
    success: true,
    message: 'Saved foods fetched successfully',
    data: savedFoods
  });
});