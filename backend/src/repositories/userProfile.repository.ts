import User from '../models/userModel';
import { Types } from 'mongoose';

export interface UserProfileRecord {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
}

export const getUserProfile = (userId: string): Promise<UserProfileRecord | null> => {
  return User.findById(userId).select('_id name email phone gender').lean();
};

export const updateUserProfile = (userId: string, updateData: Partial<UserProfileRecord>): Promise<UserProfileRecord | null> => {
  return User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, select: '_id name email phone gender' }
  ).lean();
};

const addUserAddress = (userId: string, addressData: any): Promise<UserProfileRecord | null> => {
  return User.findByIdAndUpdate(
    userId,
    { $push: { address: addressData } },
    { new: true, select: '_id name  address' }
  ).lean();
}

console.log(addUserAddress.toString());