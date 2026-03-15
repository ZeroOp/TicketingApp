import { currentUser, requireAuth, validateRequest } from '@zeroop-dev/common';
import express, {Request, Response} from 'express'
import { body } from 'express-validator';
const router = express.Router();

router.post('/api/orders',
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .withMessage('TicketId must be provided')
    ]
    , validateRequest, currentUser, async (req: Request, res: Response) => {
    res.send({});
})

export { router as newOrderRouter };