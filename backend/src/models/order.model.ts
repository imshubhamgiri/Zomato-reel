import { Schema, model, Types } from 'mongoose';

export const ORDER_STATUS = [
  'placed',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
] as const;

export const PAYMENT_STATUS = [
  'pending',
  'paid',
  'failed',
  'refunded'
] as const;

export type OrderStatus = typeof ORDER_STATUS[number];
export type PaymentStatus = typeof PAYMENT_STATUS[number];

interface DeliveryAddressSnapshot {
  label?: 'Home' | 'Work' | 'Other';
  fullName: string;
  phone: string;
  locality?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  alternatePhone?: string;
}

interface OrderItem {
  food: Types.ObjectId;
  nameSnapshot: string;
  quantity: number;
  priceSnapshot: number;
}

interface IOrder {
  user: Types.ObjectId;
  foodPartner: Types.ObjectId;
  userAddressId?: Types.ObjectId;
  deliveryAddressSnapshot: DeliveryAddressSnapshot;
  items: OrderItem[];
  price: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  placedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryAddressSnapshotSchema = new Schema<DeliveryAddressSnapshot>(
  {
    label: { type: String, enum: ['Home', 'Work', 'Other'] },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    locality: { type: String, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
    alternatePhone: { type: String, trim: true }
  },
  { _id: false }
);

const orderItemSchema = new Schema<OrderItem>(
  {
    food: { type: Schema.Types.ObjectId, ref: 'Food', required: true, index: true },
    nameSnapshot: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    priceSnapshot: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    foodPartner: { type: Schema.Types.ObjectId, ref: 'FoodPartner', required: true, index: true },
    userAddressId: { type: Schema.Types.ObjectId },
    deliveryAddressSnapshot: { type: deliveryAddressSnapshotSchema, required: true },
    items: {
      type: [orderItemSchema],
      required: true,
      // Custom validator to ensure items array is not empty
      validate: {
        validator: (v: OrderItem[]) => v.length > 0,
        message: 'Order must contain at least one item'
      }
    },
    price: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUS, default: 'placed', index: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUS, default: 'pending', index: true },
    placedAt: { type: Date, default: Date.now, index: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

orderSchema.index({ user: 1, placedAt: -1 });
orderSchema.index({ foodPartner: 1, placedAt: -1 });
orderSchema.index({ paymentStatus: 1, placedAt: -1 });
orderSchema.index({ status: 1, placedAt: -1 });

const Order = model<IOrder>('Order', orderSchema);

export default Order;
