import { Publisher, Subjects, TicketCreatedEvent } from "@zeroop-dev/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

}

