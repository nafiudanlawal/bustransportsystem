const {app} = require('../index');
const request = require('supertest');
jest.setTimeout(100000);


// Integration Tests
test("Register a user", async () => {
    return await request(app).post('/api/users/register')
    .query(
        { 
            firstname: 'George William',
            lastname: 'Kasaazi',
            role: 'admin',
            phone: '0791592011',
            email: 'kasaazi.gw@gmail.com',
            password: 'george' 
        })
    .expect(200);
});

test("Getting a user by their ID", async () => {
    return await request(app).get('/api/users/:userID')
    .query(
        { 
            userID: '626d52b7d10f89411cacbf27'
        })
    .expect(200);
});