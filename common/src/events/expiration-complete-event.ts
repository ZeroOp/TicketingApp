import { Subjects } from "./subjects";

export interface ExpirationCompleteEvent {
    subject: Subjects.ExiprationComplete;
    data: {
        orderId: string;
    }
}