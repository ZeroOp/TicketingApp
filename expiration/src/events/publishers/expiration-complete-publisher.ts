import { ExpirationCompleteEvent, Publisher, Subjects } from "@zeroop-dev/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExiprationComplete = Subjects.ExiprationComplete;
}