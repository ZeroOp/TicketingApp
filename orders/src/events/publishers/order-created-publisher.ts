import { OrderCreatedEvent, Publisher, Subjects } from "@zeroop-dev/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
