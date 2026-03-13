import nats, { Message, Stan } from 'node-nats-streaming'
import { randomBytes } from 'node:crypto';
import { TicketCreatedListner } from '../events/tickets-created-listner';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

// stan.on('connect', () => {
//     console.log('listener connected to nats');

//     stan.on('close', () => {
//         console.log('NATS connection closed!');
//         process.exit()
//     })

//     const options = stan.subscriptionOptions()
//         .setManualAckMode(true) // maual acknoledgement is set to true. if anything goes wrong in the message subscription. We need to ack till some time. 
//         .setDeliverAllAvailable() // every time we restart or lounch a service , we need the all messages delivered to this service. 
//         .setDurableName('order-service') // this will make sure one service should have a duriable subscription. when ever a service goes down , nats will dump the history of durable subscription. // they won't be coming back. 

//         // we want to add the queue group for sure with setDeliverAllAvailable option, with setDurableName along with Queue Group to persist our behaviour. 
//     const subscription = stan.subscribe(
//         'ticket:created',
//         'Queu-group',
//         options
//     );

//     subscription.on('message', (msg: Message)=> {
//         const data = msg.getData();
//         if(typeof data === 'string') {
//             console.log(`Recevied event #${msg.getSequence()}, with data: ${data}`);
//         }

//         msg.ack(); // acknoledgement of message/event. 
//     })
// })


stan.on('connect', () => {
    console.log('listener connected to nats');

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit()
    })
    new TicketCreatedListner(stan).listen();
})

