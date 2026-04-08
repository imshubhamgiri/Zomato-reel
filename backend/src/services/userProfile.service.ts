import { ValidationError } from "../utils/error";
import { getUserProfile as getUserProfileFromRepo } from "../repositories/userProfile.repository";
import { updateUserProfile as updateProfile } from "../repositories/userProfile.repository";

interface userProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    gender?: 'Male' | 'Female' | 'Other';
}

export const getUserProfile = async (userId: string): Promise<userProfile> => {
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

export const updateUserProfile = async (userId: string, updateData: Partial<userProfile>): Promise<userProfile> => {
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid user ID format');
  }
    // Implementation for updating user profile
    // This would typically involve validating the updateData, then calling a repository function to update the database
    // For now, we'll just return the updated profile as a placeholder
    const updatedProfile = await updateProfile(userId, updateData);
    if (!updatedProfile) {
      throw new ValidationError('User profile not found');
    }
    return {
        id: userId,
        name: updatedProfile.name || 'Updated Name',
        email: updatedProfile.email || 'updated@example.com',
        gender: updatedProfile.gender || 'Other',
        phone: updatedProfile.phone || '1234567890',
    };
};

