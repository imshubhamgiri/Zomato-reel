import { Request } from 'express';
import { Types } from 'mongoose';

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  user?: T;
  data?: T;
  foodItems?: T[];
  tokens?: AuthTokens;
  error?: string;
}
export interface PaginationResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    limit: number;
    hasMore: boolean;
    nextCursor: { id: string; lastCreatedAt: string } | null;
  };
}

export interface Like{
user: Types.ObjectId,
food: Types.ObjectId
}

export interface FoodItemWithStatus {
  _id: Types.ObjectId;
  name: string;
  video: string;
  videoPublicId: string;
  description: string;
  price: number;
  foodPartner: string;
  likeCount: number;
  saveCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadResponse {
    name: string;
    video: string;
    videoPublicId: string;
    description: string;
    price: number;
    type: 'standard' | 'reel';
    foodPartnerId: string;
    image: string;
}

export interface File{
  fileBuffer: Buffer,
  fileName:string,
  mimeType:string,
}

export interface FoodItemResponse {
  id: string;
  name: string;
  video: string;
  videoPublicId: string;
  description: string;
  price: number;
  foodPartner: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface AddFoodRequest {
  name: string;
  description: string;
  type: 'standard' | 'reel';
  price: number;
}

export interface UpdateFoodRequest {
  foodId: string;
  name: string;
  description: string;
  price: number;
  type: 'standard' | 'reel';
}

export interface IFood  {
  _id?:Types.ObjectId | any,
  name: string;
  video: string;
  videoPublicId: string;
  image: string;
  type: 'standard' | 'reel';
  description: string;
  price: number;
  likeCount: number;
  saveCount: number;
  foodPartner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Extended Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  type: 'user' | 'partner';
}

export interface AuthTokenPayload {
  Id: string;
  email: string;
  type: 'user' | 'partner';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Standard paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}

/**
 * Error response
 */
export interface ErrorResponse extends ApiResponse {
  success: false;
  message: string;
  error: string;
}

export interface ProfileRegister{
    name:string;
    email:string;
    password:string;
}
export interface UserLogin{
    email:string;
    password:string;
}
export interface FoodPartnerRegister{
    name:string;
    email:string;
    password:string;
    restaurantName:string;
    phone:string;
    address:string;
}
export interface PartnerResponse{
    id: string;
    name:string;
    email:string;
    restaurantName:string;
    phone:string;
    address:string;
    userType?: 'partner';
}
export interface FoodPartnerLogin{
    email:string;
    password:string;
}

export interface ProfileResponse {
    id: string;
    name: string;
    email: string;
    userType?: 'user';
}

export interface UserAddress {
    _id?: Types.ObjectId;
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

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    gender?: 'Male' | 'Female' | 'Other';
}

export interface SavedFood {
  saveId: string;
  savedAt: Date;
  food: {
    id: string;
    name: string;
    image?: string;
    video?: string;
    type: 'standard' | 'reel';
    description: string;
    price: number;
    likeCount: number;
    saveCount: number;
    foodPartner: string;
  };
}
