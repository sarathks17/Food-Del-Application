import express from 'express'
import authMiddleware from '../Middleware/auth.js'
import { placeOrder, userOrders } from '../Controllers/orderController.js'
import { verifyOrder } from '../Controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/userorders",authMiddleware,userOrders)

export default orderRouter;