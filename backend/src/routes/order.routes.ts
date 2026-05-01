import { Router } from 'express';
import { userAuthMiddleware } from '../middleware/auth';
import { createOrder, getAllOrders } from '../controllers/order.Controller';
import { validateOrderSchemaRequest } from '../middleware/validation';

const router = Router();

router.post('/', userAuthMiddleware, validateOrderSchemaRequest, createOrder);
router.get('/my-orders', userAuthMiddleware, getAllOrders);
export default router;
