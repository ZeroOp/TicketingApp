import { Message, Stan } from "node-nats-streaming";
import { Listener } from "./base-listner";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListner extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payment-service';
    constructor(client: Stan) {
        super(client);
    }
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data', data);

        msg.ack();
    }
}