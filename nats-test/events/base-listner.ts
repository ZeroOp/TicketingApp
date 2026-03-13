import nats, { Message, Stan } from 'node-nats-streaming'
export abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void;
    protected client : Stan;
    protected ackWait = 5*1000; // 5 seconds.

    constructor(client : Stan) {
        this.client = client;
    }

    subscriptionOptionis() {
        return this.client.subscriptionOptions()
                          .setDeliverAllAvailable()
                          .setManualAckMode(true)
                          .setAckWait(this.ackWait)
                          .setDurableName(this.queueGroupName)
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptionis()
        )

        subscription.on('message' , (msg: Message) => {
            console.log(
                `Message recived: ${this.subject} / ${this.queueGroupName}`
            );

            const parseData = this.parseMessage(msg);

            this.onMessage(parseData, msg);
        })
    }

    parseMessage(msg: Message) {
        const data = msg.getData();

        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8'))
    }
}