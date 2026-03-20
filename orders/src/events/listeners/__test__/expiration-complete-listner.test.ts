import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListner } from "../expiration-complete-listner"
import { Order } from "../../../models/orders";
import { ExpirationCompleteEvent, OrderStatus } from "@zeroop-dev/common";
import { Message } from "node-nats-streaming";

const setup = async ()=> {
    const listener = new ExpirationCompleteListner(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asdf',
        expiresAt: new Date(),
        ticket,
    });
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId : order.id
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, ticket, data, msg };
}

it('updated the order status to cancelled', async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emits an OrderCancelled event with correct data', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const publishMock = natsWrapper.client.publish as jest.Mock;

    expect(publishMock).toHaveBeenCalled();

    // ✅ get ALL cancelled events in THIS test
    const cancelledEvents = publishMock.mock.calls.filter(
        (call) => call[0] === 'order:cancelled'
    );

    expect(cancelledEvents.length).toBeGreaterThan(0);

    // ✅ take the LAST one (most recent)
    const eventData = JSON.parse(
        cancelledEvents[cancelledEvents.length - 1][1]
    );

    expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})