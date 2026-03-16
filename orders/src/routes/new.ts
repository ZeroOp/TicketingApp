import { BadRequestError, currentUser, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@zeroop-dev/common';
import express, {Request, Response} from 'express'
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/orders';
const router = express.Router();

const EXIPRATION_WINDOW_SECONDS = 15*60;

router.post('/api/orders',
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .withMessage('TicketId must be provided')
    ]
    , validateRequest, currentUser, async (req: Request, res: Response) => {
    
    const { ticketId } = req.body;
    // Find the ticket the user is tyring to order in the database. 
    const ticket = await Ticket.findById(ticketId);

    if(!ticket) {
        throw new NotFoundError();
    }
    
    // Make sure that this ticket is not already reserved

    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date to this order. 

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXIPRATION_WINDOW_SECONDS)

    //Build the ordre and save it to the database. 

    const order = Order.build({
        userId : req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    })

    await order.save();
    // Publish an event saying that an order was created
    res.status(201).send(order);
})

export { router as newOrderRouter };