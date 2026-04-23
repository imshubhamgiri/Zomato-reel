import { Router } from 'express';
import { userAuthMiddleware } from '../middleware/auth';
import { createOrder } from '../controllers/order.Controller';
import { validateOrderSchemaRequest } from '../middleware/validation';

const router = Router();

router.post('/', userAuthMiddleware, validateOrderSchemaRequest, createOrder);

export default router;
