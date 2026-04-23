import Order from '../models/order.model';
import type { IOrder } from '../models/order.model';

type CreateOrderRepositoryInput = Pick<
    IOrder,
    'user' | 'foodPartner' | 'userAddressId' | 'deliveryAddressSnapshot' | 'items' | 'price'
>;

export const createOrder = async (orderData: CreateOrderRepositoryInput): Promise<IOrder> => {
    const order = new Order(orderData);
    return order.save();
};