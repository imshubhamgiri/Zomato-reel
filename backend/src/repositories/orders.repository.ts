import Order from "../models/order.model";
import { IOrder } from "../models/order.model";


export const createdOrder = async(orderData:IOrder): Promise<IOrder> => {
    const order = new Order(orderData);
    return await order.save();
}