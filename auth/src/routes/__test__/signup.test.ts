import request from 'supertest'
import {app} from '../../app'

it('returns a 201 on successful signup', async() => {
    const email : string = "test@test.com";
    const password: string = "password";
    return request(app)
        .post('/api/users/signup')
        .send({
            email: email,
            password: password
        })
        .expect(201)
});

it('returns a 400 with a invalid email',  async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test',
            password: 'password'
        })
        .expect(400)
})

it('returns a 400 with a invalid password',  async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'as'
        })
        .expect(400)
});


it('returns a 400 with a invalid with missing password and email',  async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com"
        })
        .expect(400)

    return request(app)
        .post('/api/users/signup')
        .send({
            password: 'password'
        })
        .expect(400)
});


it('disallows duplicate emails', async () => {
    const email : string = "test@test.com";
    const password: string = "password";
    await request(app)
        .post('/api/users/signup')
        .send({
            email: email,
            password: password
        })
        .expect(201)
    
    return request(app)
        .post('/api/users/signup')
        .send({
            email: email,
            password: password
        })
        .expect(400)
});

it('sets a cookie after successfull signup', async () => {
    const email : string = "test@test.com";
    const password: string = "password";
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: email,
            password: password
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined();
})