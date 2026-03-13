import nats, { Message, Stan } from 'node-nats-streaming'
import { randomBytes } from 'node:crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('listener connected to nats');

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit()
    })

    const options = stan.subscriptionOptions()
        .setManualAckMode(true) // maual acknoledgement is set to true. if anything goes wrong in the message subscription. We need to ack till some time. 
        .setDeliverAllAvailable() // every time we restart or lounch a service , we need the all messages delivered to this service. 
        .setDurableName('order-service') // this will make sure one service should have a duriable subscription. when ever a service goes down , nats will dump the history of durable subscription. // they won't be coming back. 

        // we want to add the queue group for sure with setDeliverAllAvailable option, with setDurableName along with Queue Group to persist our behaviour. 
    const subscription = stan.subscribe(
        'ticket:created',
        'Queu-group',
        options
    );

    subscription.on('message', (msg: Message)=> {
        const data = msg.getData();
        if(typeof data === 'string') {
            console.log(`Recevied event #${msg.getSequence()}, with data: ${data}`);
        }

        msg.ack(); // acknoledgement of message/event. 
    })
})

// close the listener as soon as the process end. if you recive these the oricess will send signals immediately to the nat server this connection doesn't exists any more. 
// these signals will be differ for os. (windows / mac / linux)
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', ()=> stan.close());


abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void;
    private client : Stan;
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