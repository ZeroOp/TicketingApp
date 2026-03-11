import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose';
import { title } from 'node:process';

it("returns a 404 if the provided id does not exists", async ()=> {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Title 1',
            price: 20
        })
        .expect(404);
})

it("returns a 401 if the user is not authenticated", async ()=> {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'Title 1',
            price: 20
        })
        .expect(401);
})

it("returns a 401 if the user is not owner of the ticket", async ()=> {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Title 1',
            price: 20
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Title 2',
            price: 21
        })
        .expect(401)
})

it("returns 400 if the title and password are invalid", async ()=> {
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin();
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Title 1',
            price: 20
        })
        .expect(404);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            titile: '',
            price: 20
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            titile: 'Title1',
            price: -20
        })
        .expect(400)

})

it("updated the tickets provided valid inputs", async ()=> {
    const cookie = global.signin();
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdflkjs',
            price: 20
        });
    const title = "new title" , price = 100;

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: title,
            price: price
        })
        .expect(200)
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
    
})