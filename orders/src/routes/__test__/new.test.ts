import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket, TicketDoc } from '../../models/ticket';
import { Order } from '../../models/orders';
import { OrderStatus } from '@zeroop-dev/common';

it("returns an error if the ticket does not exists", async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticketId
        })
        .expect(404)
})

it("returns an error if the ticket is already reserved", async () => {
    const ticket: TicketDoc = Ticket.build({
        title: 'Concert',
        price: 20
    })
    await ticket.save();

    const order = Order.build({
        ticket: ticket,
        userId: 'asdlkjfds',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })

    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ticketId: ticket._id})
        .expect(400)
})

it("reserves a ticket", async () => {
    const ticket: TicketDoc = Ticket.build({
        title: 'Concert',
        price: 20
    })
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ticketId: ticket._id})
        .expect(201)
})

it.todo("emits an order created event")