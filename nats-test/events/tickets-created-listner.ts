import { Message, Stan } from "node-nats-streaming";
import { Listener } from "./base-listner";

export class TicketCreatedListner extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'payment-service';
    constructor(client: Stan) {
        super(client);
    }
    onMessage(data: any, msg: Message): void {
        console.log('Event data', data);


        msg.ack();
    }
}