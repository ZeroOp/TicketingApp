import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from '../events/ticket-created-publisher';

console.clear()
// stan is nats streaming service or you can call it as clients. 
// stan is opposite of nats.
const stan = nats.connect('ticketing', '123', {
  url: 'http://localhost:4222'
});

stan.on('connect',async () => {
    // console.log("publisher is connected to nats");

    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // });

    // stan.publish('ticket:created', data, ()=> {
    //     console.log("Event published");
    // })

    const publisher = new TicketCreatedPublisher(stan)

    try {
      await publisher.publish({
          id: '123',
          title: 'conecrt',
          price: 20
      })
    } catch(err) {
      console.error(err);
    }

});