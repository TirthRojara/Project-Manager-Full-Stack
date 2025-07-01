const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, setupDatabase } = require('./fixtures/db')



// beforeEach(async () => {
//     await User.deleteMany()
//     await new User(userOne).save()
// })

beforeEach(setupDatabase)


// test('Hello World!', () => {

// })


test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Tirth Test',
            email: 'tirth744clg@gmail.com',
            password: 'tirth744'
        })
        .expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertion about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Tirth Test',
            email: 'tirth744clg@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('tirth744')

})


test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOne._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'name@gmail.com',
        password: 'name7444'
    }).expect(400)
})


test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticate user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})


test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('av', 'tests/fixtures/nature_1.jpg')
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})


test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.name).toEqual('Jess')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Rajkot'
        })
        .expect(400)
})









