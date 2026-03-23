import { Request, Response } from 'express';
import type { ApiResponse, ErrorResponse, AuthenticatedRequest,FoodItemWithStatus,  AddFoodRequest,  UploadResponse ,File,  FoodItemResponse, UpdateFoodRequest } from '../types';
import food from '../models/food.model';
// import likedFood from '../models/like.model';
// import savedFood from '../models/save.model';
import storageService from '../service/storage.service';
import { v4 as uuid } from 'uuid';
import { error } from 'node:console';
import foodService from '../services/food.service';



export const addFoodItem = async (
  req: Request<{}, {}, AddFoodRequest> & { user?: any; file?: Express.Multer.File },
  res: Response<ApiResponse<UploadResponse> | ErrorResponse>
): Promise<void> => {
  try {
    const foodpartner = req.user;
    if(foodpartner.type !== 'partner') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Only food partners can add food items',
        error: 'Unauthorized',
      });
      return;
    }
    if (!foodpartner.id || !req.file) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: No food partner info',
        error: 'Missing partner info or file',
      });
      return;
    }

    const { name, description, price } = req.body;
    
    const file:File ={
      fileBuffer:req.file.buffer,
      fileName:uuid(),
      mimeType:  req.file.mimetype
    }

    const imageUploadResponse= await storageService.uploadVideo(file);

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
  res: Response<ApiResponse<FoodItemWithStatus[]> | ErrorResponse>
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const foodItemsWithStatus: FoodItemWithStatus[] = await foodService.getFoodItems(userId);
  

    res.status(200).json({
      success: true,
      message: 'Food items retrieved successfully',
      data: foodItemsWithStatus,
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
  req: Request<{}, {}, { foodId: string }> & { user?: any },
  res: Response<ApiResponse | ErrorResponse>
): Promise<void> => {
  const { foodId } = req.body;

  if (!req.user || !req.user.id) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: No user info',
      error: 'Missing user info',
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

    if (fooditem.foodPartner.toString() !== req.user.id) {
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
  req: Request<{}, {}, UpdateFoodRequest> & { user?: any },
  res: Response<ApiResponse<UploadResponse> | ErrorResponse>
): Promise<void> => {
  const { foodId, name, description, price } = req.body;

  if (!req.user || !req.user.id) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: No user info',
      error: 'Missing user info',
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

    if (foodItem.foodPartner.toString() !== req.user.id) {
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