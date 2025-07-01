
const request = require('supertest')
const app = require('../src/app')
const Project = require('../src/models/project')
const {
    userOne,
    u1projectOne,
    u1projectTwo,
    u1gymTask_1,
    u1gymTask_2,
    u1codeTask_1,
    u1codeTask_2,
    userTwo,
    u2_projectOne,
    u2_projectTwo,
    u2_BookTask_1,
    u2_BookTask_2,
    u2_ClimbTask_1,
    u2_ClimbTask_2,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)


// test('Hello World!', () => {

// })



test('Should create project for user', async () => {
    const response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            projectName: 'first test project'
        })
        .expect(201)

    const project = await Project.findById(response.body._id)
    expect(project).not.toBeNull()
    expect(project.completed).toEqual(false)
    expect(project.projectName).toEqual('first test project')
    expect(project.owner).toEqual(userOne._id)
})

test('Should not create project without authentication', async () => {
    await request(app)
       .post('/projects')
        .send({
           projectName: 'first test project'
        })
        .expect(401)
})


test('Should fetch user projects', async () => {
    const response = await request(app)
        .get('/projects')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    expect(response.body.length).toEqual(2)
})


test('Should not delete other users project', async () => {
    const response = await request(app)
        .delete(`/projects/${u1projectOne._id}`)
       .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const project = await Project.findById(u1projectOne._id)
    expect(project).not.toBeNull()

})


test('Should delete own project', async () => {
    const response = await request(app)
        .delete(`/projects/${u1projectOne._id}`)
       .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const project = await Project.findById(u1projectOne._id)
    expect(project).toBeNull()

})


test('Should update own project', async () => {
    const response = await request(app)
        .patch(`/projects/${u1projectOne._id}`)
       .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            projectName: 'changeName'
        })
        .expect(200)

    const project = await Project.findById(u1projectOne._id)
    expect(project.projectName).toEqual('changeName')
    expect(project.projectName).not.toEqual('GYM')

})


test('Should not update invalid project fields', async () => {
    const response = await request(app)
        .patch(`/projects/${u1projectOne._id}`)
       .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'changeName'
        })
        .expect(400)

})


test('Should not update other users project', async () => {
    const response = await request(app)
        .patch(`/projects/${u1projectOne._id}`)
       .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
             projectName: 'changeName'
        })
        .expect(404)

    const project = await Project.findById(u1projectOne._id)
    expect(project).not.toBeNull()
     expect(project.projectName).toEqual('GYM')

})
