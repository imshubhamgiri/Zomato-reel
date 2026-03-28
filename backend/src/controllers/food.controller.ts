import { Request, Response } from 'express';
import type { ApiResponse, ErrorResponse, AuthenticatedRequest, FoodItemWithStatus, AddFoodRequest, UploadResponse, File, FoodItemResponse, UpdateFoodRequest, PaginationResponse } from '../types';
import food from '../models/food.model';
import storageService from '../service/storage.service';
import { v4 as uuid } from 'uuid';
import foodService from '../services/food.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ForbiddenError, AuthError } from '../utils/error';

export const addFoodItem = asyncHandler(
  async (
    req: Request<{}, {}, AddFoodRequest> & { user?: any; file?: Express.Multer.File },
    res: Response<ApiResponse<UploadResponse> | ErrorResponse>
  ): Promise<void> => {
    const foodpartner = req.user;
    
    if (foodpartner?.type !== 'partner') {
      throw new ForbiddenError('Only food partners can add food items');
    }
    
    if (!foodpartner?.id || !req.file) {
      throw new AuthError('No food partner info or file provided');
    }

    const { name, description, price } = req.body;

    const file: File = {
      fileBuffer: req.file.buffer,
      fileName: uuid(),
      mimeType: req.file.mimetype
    };

    const imageUploadResponse = await storageService.uploadVideo(file);

    const foodPartnerId = req.user.id;
    const newFoodItem = new food({
      name,
      video: imageUploadResponse.url,
      videoPublicId: imageUploadResponse.fileId,
      description,
      price,
      foodPartner: foodPartnerId,
    });

    await newFoodItem.save();

    res.status(201).json({
      success: true,
      message: 'Food item added successfully',
      data: {
        name: newFoodItem.name,
        video: newFoodItem.video,
        videoPublicId: newFoodItem.videoPublicId,
        description: newFoodItem.description,
        price: newFoodItem.price,
        foodPartnerId: newFoodItem.foodPartner.toString(),
      },
    });
  }
);

export const getFoodItems = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response<PaginationResponse<FoodItemWithStatus> | ErrorResponse>
  ): Promise<void> => {
    const userId = req.user?.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 2;
    const { id, lastCreatedAt } = req.query;

    const paginatedResponse = await foodService.getFoodItems(
      userId as string,
      limit,
      id as string,
      lastCreatedAt as string
    );

    res.status(200).json({
      success: true,
      message: 'Food items retrieved successfully',
      data: paginatedResponse.foods,
      pagination: {
        total: paginatedResponse.total,
        limit,
        hasMore: paginatedResponse.hasMore,
        nextCursor: paginatedResponse.nextCursor,
      },
    });
  }
);

export const GetfoodById = asyncHandler(
  async (req: Request, res: Response<ApiResponse<FoodItemResponse[]> | ErrorResponse>): Promise<void> => {
    const { id } = req.params as { id: string };
    
    // Service handles validation and throws errors if invalid
    const response = await foodService.getFoodByPartnerId(id);

    res.status(200).json({
      success: true,
      message: 'Food retrieved successfully',
      foodItems: response as any,
    });
  }
) as any;

export const deleteFoodItem = asyncHandler(
  async (
    req: Request<{}, {}, { foodId: string }> & { user?: any },
    res: Response<ApiResponse | ErrorResponse>
  ): Promise<void> => {
    const { foodId } = req.body;

    if (!req.user?.id) {
      throw new AuthError('User information is missing');
    }

    // Service handles validation and throws errors if invalid
    await foodService.deleteFoodItem(foodId, req.user.id);
    
    const fooditem = await food.findById(foodId);
    await storageService.deleteVideo(fooditem!.videoPublicId);
    await food.findByIdAndDelete(foodId);

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully',
    });
  }
);

export const updateFoodItem = asyncHandler(
  async (
    req: Request<{}, {}, UpdateFoodRequest> & { user?: any },
    res: Response<ApiResponse<UploadResponse> | ErrorResponse>
  ): Promise<void> => {
    const { foodId, name, description, price } = req.body;

    if (!req.user?.id) {
      throw new AuthError('User information is missing');
    }

    // Service handles validation and throws errors if invalid
    await foodService.checkFoodOwnership(foodId, req.user.id);

    const updatedFood = await food.findByIdAndUpdate(
      foodId,
      { name, description, price },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      data: {
        name: updatedFood!.name,
        video: updatedFood!.video,
        videoPublicId: updatedFood!.videoPublicId,
        description: updatedFood!.description,
        price: updatedFood!.price,
        foodPartnerId: updatedFood!.foodPartner.toString(),
      },
    });
  }
);