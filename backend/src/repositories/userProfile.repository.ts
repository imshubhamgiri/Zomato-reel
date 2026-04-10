import User from '../models/userModel';
import { Types } from 'mongoose';
import type { UserAddress } from '../types';

export interface UserProfileRecord {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: UserAddress[];
}

export const getUserProfile = (userId: string): Promise<UserProfileRecord | null> => {
  return User.findById(userId).select('_id name email phone gender').lean() as Promise<UserProfileRecord | null>;
};

export const updateUserProfile = (userId: string, updateData: Partial<UserProfileRecord>): Promise<UserProfileRecord | null> => {
  return User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, select: '_id name email phone gender' }
  ).lean() as Promise<UserProfileRecord | null>;
};

export const addUserAddress = (userId: string, addressData: any): Promise<UserProfileRecord | null> => {
  return User.findByIdAndUpdate(
    userId,
    { $push: { address: addressData } },
    { new: true, select: '_id name email phone gender address' }
  ).lean() as Promise<UserProfileRecord | null>;
};

export const getUserAddresses = (userId: string): Promise<UserProfileRecord | null> => {
  return User.findById(userId).select('_id name email phone gender address').lean() as Promise<UserProfileRecord | null>;
};

export const deleteUserAddress = (userId: string, addressId: string): Promise<UserProfileRecord | null> => {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { address: { _id: addressId } } },
    { new: true, select: '_id name email phone gender address' }
  ).lean() as Promise<UserProfileRecord | null>;
};

export const updateUserAddress = (userId: string, addressId: string, updateData: Partial<UserAddress>): Promise<UserProfileRecord | null> => {
  return User.findByIdAndUpdate(
    userId,
    { $set: { 'address.$[addr]': updateData } },
    { 
      new: true,
      arrayFilters: [{ 'addr._id': addressId }],
      select: '_id name email phone gender address'
    }
  ).lean() as Promise<UserProfileRecord | null>;
};
