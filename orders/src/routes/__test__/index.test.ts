import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket, TicketDoc } from "../../models/ticket"
import request from "supertest";

const buildTicket = async (): Promise<TicketDoc> => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save();
    return ticket;
}

it("fetches order for an pirticular user", async () => {
    // create three tickets. 
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();
    // created one order as User #1 
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId: ticketOne.id})
        .expect(201)
        
    // created one order as User #2
    const {body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketTwo.id})
        .expect(201)
        
    const {body: orderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketThree.id})
        .expect(201)

    // Make request to get orders for User #2

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    // Make sure we only got the orders for User #2
    expect(response.body.length).toEqual(2);

    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
})