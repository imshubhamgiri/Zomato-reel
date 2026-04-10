import { ValidationError } from "../utils/error";
import { getUserProfile as getUserProfileFromRepo } from "../repositories/userProfile.repository";
import { updateUserProfile as updateProfile } from "../repositories/userProfile.repository";
import { addUserAddress, getUserAddresses as getAddressesFromRepo , deleteUserAddress as Deleteaddress, updateUserAddress as updateAddressInRepo } from "../repositories/userProfile.repository";
import type { UserProfile, UserAddress } from "../types";

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid user ID format');
  }
    const profile = await getUserProfileFromRepo(userId);
    if (!profile) {
      throw new ValidationError('User profile not found');
    }
    return {
     id: profile._id.toString(),
     name: profile.name,
     email: profile.email,
     phone: profile.phone,
     gender: profile.gender,
    };
};

export const updateUserProfile = async (userId: string, updateData: Partial<UserProfile>): Promise<UserProfile> => {
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid user ID format');
  }
    const updatedProfile = await updateProfile(userId, updateData);
    if (!updatedProfile) {
      throw new ValidationError('User profile not found');
    }
    return {
        id: updatedProfile._id.toString(),
        name: updatedProfile.name,
        email: updatedProfile.email,
        gender: updatedProfile.gender,
        phone: updatedProfile.phone,
    };
};

export const addAddress = async(userId: string, addressData: UserAddress): Promise<UserAddress> => {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid user ID format');
    }
    
    const updatedProfile = await addUserAddress(userId, addressData);
    if (!updatedProfile) {
        throw new ValidationError('Failed to add address');
    }

    // Return the last added address
    const addedAddress = updatedProfile.address?.[updatedProfile.address.length - 1];
    if (!addedAddress) {
        throw new ValidationError('Address not found in profile');
    }

    return addedAddress;
};

export const getUserAddresses = async(userId: string): Promise<UserAddress[]> => {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError('Invalid user ID format');
    }
    
    const userWithAddresses = await getAddressesFromRepo(userId);
    if (!userWithAddresses) {
        throw new ValidationError('User profile not found');
    }

    return (userWithAddresses.address || []) as UserAddress[];
};


export const deleteUserAddress = async(userId: string, addressId: string): Promise<void> => {
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid user ID format');
  }
  if (!addressId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid address ID format');
  }
  await Deleteaddress(userId, addressId);
};

export const updateAddress = async(userId: string, addressId: string, updateData: Partial<UserAddress>): Promise<UserAddress> => {
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid user ID format');
  }
  if (!addressId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid address ID format');
  }
  
  const updatedProfile = await updateAddressInRepo(userId, addressId, updateData);
  if (!updatedProfile) {
    throw new ValidationError('Failed to update address');
  }

  // Find the updated address in the profile
  const updatedAddress = updatedProfile.address?.find(addr => addr._id?.toString() === addressId);
  if (!updatedAddress) {
    throw new ValidationError('Address not found in profile');
  }

  return updatedAddress;
};
