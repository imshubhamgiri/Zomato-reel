import { Request, Response } from 'express';
import type { ApiResponse, ErrorResponse, AuthenticatedRequest } from '../types';
import food from '../models/food.model';
import likedFood from '../models/like.model';
import savedFood from '../models/save.model';
import storageService from '../service/storage.service';
import { v4 as uuid } from 'uuid';
import { error } from 'node:console';

interface UploadResponse {
    name: string;
    video: string;
    videoPublicId: string;
    description: string;
    price: number;
    foodPartnerId: string;
}

interface FoodItemResponse {
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

interface AddFoodRequest {
  name: string;
  description: string;
  price: number;
}

interface UpdateFoodRequest {
  foodId: string;
  name: string;
  description: string;
  price: number;
}

export const addFoodItem = async (
  req: Request<{}, {}, AddFoodRequest> & { foodPartner?: any; file?: Express.Multer.File },
  res: Response<ApiResponse<UploadResponse> | ErrorResponse>
): Promise<void> => {
  try {
    if (!req.foodPartner || !req.foodPartner.id || !req.file) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: No food partner info',
        error: 'Missing partner info or file',
      });
      return;
    }

    const { name, description, price } = req.body;

    const imageUploadResponse = await storageService.uploadVideo(
      req.file.buffer,
      uuid(),
      req.file.mimetype
    );

    const foodPartnerId = req.foodPartner.id;
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
  } catch (error) {
    console.error('Add food item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add food item',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getFoodItems = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<FoodItemResponse[]> | ErrorResponse>
): Promise<void> => {
  try {
    const foodItems = await food.find().populate('foodPartner', 'name').lean();
    const userId = req.user?.id;

    if (!userId) {
      res.status(200).json({
        success: true,
        message: 'Food items retrieved successfully',
        data: foodItems as any,
      });
      return;
    }

    const foodItemIds = foodItems.map((item: any) => item._id);

    const userLikes = await likedFood
      .find({
        userId: userId,
        food: { $in: foodItemIds },
      })
      .select('food')
      .lean();

    const userSaves = await savedFood
      .find({
        userId: userId,
        food: { $in: foodItemIds },
      })
      .select('food')
      .lean();

    const likedFoodIds = new Set(userLikes.map((like: any) => like.food.toString()));
    const savedFoodIds = new Set(userSaves.map((save: any) => save.food.toString()));

    const foodItemsWithStatus = foodItems.map((item: any) => {
      const itemIdString = item._id.toString();

      return {
        ...item,
        isLiked: likedFoodIds.has(itemIdString),
        isSaved: savedFoodIds.has(itemIdString),
      };
    });

    res.status(200).json({
      success: true,
      message: 'Food items retrieved successfully',
      data: foodItemsWithStatus as any,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve food items',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const GetfoodById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<FoodItemResponse[]> | ErrorResponse>
): Promise<void> => {
  if (!req.params.id) {
    res.status(400).json({
      success: false,
      message: 'Partner Id is required',
      error: 'Missing id parameter',
    });
    return;
  }

  const id = req.params.id;

  try {
    const response = await food.find({ foodPartner: id });

    res.status(200).json({
      success: true,
      message: 'Food retrieved successfully',
      foodItems: response as any,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve food items',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteFoodItem = async (
  req: Request<{}, {}, { foodId: string }> & { foodPartner?: any },
  res: Response<ApiResponse | ErrorResponse>
): Promise<void> => {
  const { foodId } = req.body;

  if (!req.foodPartner || !req.foodPartner.id) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: No food partner info',
      error: 'Missing partner info',
    });
    return;
  }

  try {
    const fooditem = await food.findById(foodId);

    if (!fooditem) {
      res.status(404).json({
        success: false,
        message: 'Food item not found',
        error: 'Not found',
      });
      return;
    }

    if (fooditem.foodPartner.toString() !== req.foodPartner.id) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own food items',
        error: 'Unauthorized',
      });
      return;
    }

    await storageService.deleteVideo(fooditem.videoPublicId);
    await food.findByIdAndDelete(foodId);

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully',
    });
  } catch (error) {
    console.error('Delete food item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete food item',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateFoodItem = async (
  req: Request<{}, {}, UpdateFoodRequest> & { foodPartner?: any },
  res: Response<ApiResponse<UploadResponse> | ErrorResponse>
): Promise<void> => {
  const { foodId, name, description, price } = req.body;

  if (!req.foodPartner || !req.foodPartner.id) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: No food partner info',
      error: 'Missing partner info',
    });
    return;
  }

  try {
    const foodItem = await food.findById(foodId);

    if (!foodItem) {
      res.status(404).json({
        success: false,
        message: 'Food item not found',
        error: 'Not found',
      });
      return;
    }

    if (foodItem.foodPartner.toString() !== req.foodPartner.id) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own food items',
        error: 'Unauthorized',
      });
      return;
    }

    const updatedFood = await food.findByIdAndUpdate(
      foodId,
      { name, description, price },
      { new: true }
    );

    if (!updatedFood) {
      res.status(404).json({
        success: false,
        message: 'Failed to update food item',
        error: error instanceof Error ? error.message : 'Food item not found after update',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      data: {
        name: updatedFood.name,
        video: updatedFood.video,
        videoPublicId: updatedFood.videoPublicId,
        description: updatedFood.description,
        price: updatedFood.price,
        foodPartnerId: updatedFood.foodPartner.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update food item',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};