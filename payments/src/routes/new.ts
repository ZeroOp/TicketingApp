import { body } from "express-validator";
import express, { Request, Response } from 'express'
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@zeroop-dev/common";
import { Order } from "../models/order";
const router = express.Router()

router.post('/api/payments', 
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not()
            .isEmpty()
    ],
    validateRequest,
    async (req:Request, res:Response)=>{
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if(!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("Cannot pay for an cancelled order");
        }

        
})

export { router as createChargeRouter };