import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListner  } from "../ticket-updated-listner";
import { TicketUpdatedEvent } from '@zeroop-dev/common'
import mongoose from "mongoose";

const setup  = async () => {
    // Create a listner
    const listner = new TicketUpdatedListner(natsWrapper.client);
    // Create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })

    await ticket.save();

    // create a fake data object
    const data : TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 1234,
        userId: 'adlfk'
    }
    // create a fake msg object
    //@ts-ignore
    const msg : Message = {
        ack: jest.fn()
    }
    // return all of this stuff
    return { msg, data, ticket, listner }
}

it('finds , updated and saves a ticket', async ()=> {
    const { msg, data, ticket, listner } = await setup();

    await listner.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})

it('acks the message', async () => {
    const { msg, data, ticket, listner } = await setup();

    await listner.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async ()=> {
    const { msg, data, ticket, listner } = await setup();
    data.version = 10; 
    try {
        await listner.onMessage(data, msg);
    } catch(err) {

    }
    expect(msg.ack).not.toHaveBeenCalled();
})