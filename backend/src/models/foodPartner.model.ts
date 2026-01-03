import mongoose, { Document, Schema } from 'mongoose';

export interface IFoodPartner extends Document {
  name: string;
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const foodPartnerSchema = new Schema<IFoodPartner>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    restaurantName: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Phone must be 10 digits'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
  },
  {
    timestamps: true,
  }
);

export const FoodPartner = mongoose.model<IFoodPartner>('FoodPartner', foodPartnerSchema);
