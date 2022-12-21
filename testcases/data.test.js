const request = require('supertest')
const app = require('../app')

test('Should register the user', async () => {
    await request(app).post('/signup').send({
        name: 'kishan khatri',
        email: 'kishan1122@gmail.com',
        password: 'kishan123'
    }).expect(200)
})

test('Should login the user', async () => {
    await request(app).post('/login').send({
        email: 'kishan@gmail.com',
        password: 'kishan123'
    }).expect(200)
})

