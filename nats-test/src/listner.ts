import nats, { Message } from 'node-nats-streaming'
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
    const subscription = stan.subscribe(
        'ticket:created' ,
        'LinsterQueueGroup',
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