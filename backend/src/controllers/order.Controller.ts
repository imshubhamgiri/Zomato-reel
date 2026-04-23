import { Response } from 'express';
import type { ApiResponse, AuthenticatedRequest, ErrorResponse } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthError } from '../utils/error';
import * as orderService from '../services/order.service';

type CreateOrderResponse = {
	id: string;
	user: string;
	foodPartner: string;
	price: number;
	status: string;
	paymentStatus: string;
	placedAt: Date;
};

export const createOrder = asyncHandler(
	async (
		req: AuthenticatedRequest,
		res: Response<ApiResponse<CreateOrderResponse> | ErrorResponse>
	): Promise<void> => {
		if (!req.user?.id) {
			throw new AuthError('User not authenticated');
		}

		const order = await orderService.createOrder(req.body, req.user.id);

		res.status(201).json({
			success: true,
			message: 'Order created successfully',
			data: {
				id: (order as any)._id.toString(),
				user: order.user.toString(),
				foodPartner: order.foodPartner.toString(),
				price: order.price,
				status: order.status,
				paymentStatus: order.paymentStatus,
				placedAt: order.placedAt,
			},
		});
	}
);
