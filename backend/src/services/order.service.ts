import type { IOrder } from '../models/order.model';
import { createOrder as createOrderRepo } from '../repositories/orders.repository';

type CreateOrderItemInput = {
  food: string;
  nameSnapshot: string;
  quantity: number;
  priceSnapshot: number;
};

type DeliveryAddressInput = {
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
};

export type CreateOrderInput = {
  foodPartner: string;
  userAddressId?: string;
  deliveryAddressSnapshot: DeliveryAddressInput;
  items: CreateOrderItemInput[];
};

export const createOrder = async (orderData: CreateOrderInput, userId: string): Promise<IOrder> => {
  const computedTotal = orderData.items.reduce(
    (sum, item) => sum + item.quantity * item.priceSnapshot,
    0
  );

  return createOrderRepo({
    user: userId as unknown as IOrder['user'],
    foodPartner: orderData.foodPartner as unknown as IOrder['foodPartner'],
    userAddressId: orderData.userAddressId as unknown as IOrder['userAddressId'],
    deliveryAddressSnapshot: orderData.deliveryAddressSnapshot,
    items: orderData.items as unknown as IOrder['items'],
    price: computedTotal,
  });
};