const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
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


test('Should create task for user-1 => project-1', async () => {
    const response = await request(app)
        .post(`/tasks/${u1projectOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
    expect(task.description).toEqual('From my test')
    expect(task.owner).toEqual(userOne._id)
    expect(task.taskByProject).toEqual(u1projectOne._id)

})


test('Should not create task for non-existent project', async () => {
    const fakeProjectId = '507f1f77bcf86cd799439011'
    await request(app)
        .post(`/tasks/${fakeProjectId}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'fake project'
        })
        .expect(404)
})

test('Should not create task for other users project', async () => {
    await request(app)
        .post(`/tasks/${u2_projectOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Task for user2 project'
        })
        .expect(404)
})

test('Should not create task without authentication', async () => {
    await request(app)
        .post(`/tasks/${u1projectOne._id}`)
        .send({
            description: 'Unauthorized task'
        })
        .expect(401)
})


test('Should fetch user tasks for specific project', async () => {
    const response = await request(app)
        .get(`/tasks/${u1projectOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    
    expect(response.body.length).toEqual(2) // u1gymTask_1 and u1gymTask_2

    // response.body.forEach(task => {
    //     expect(task.taskByProject.toString()).toEqual(u1projectOne._id.toString())
    // })

    expect(response.body[0].taskByProject.toString()).toEqual(u1projectOne._id.toString())
    expect(response.body[1].taskByProject.toString()).toEqual(u1projectOne._id.toString())
})


test('Should not fetch tasks for non-existent project', async () => {
    const fakeProjectId = '507f1f77bcf86cd799439011'
    await request(app)
        .get(`/tasks/${fakeProjectId}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)
})


test('Should not fetch tasks for other users project', async () => {
    await request(app)
        .get(`/tasks/${u2_projectOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)
})


test('Should fetch individual task by ID', async () => {
    const response = await request(app)
        .get(`/tasks/${u1projectOne._id}/${u1gymTask_1._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    
    expect(response.body._id).toEqual(u1gymTask_1._id.toString())
    expect(response.body.taskByProject).toEqual(u1projectOne._id.toString())
})

test('Should not fetch task with wrong project ID', async () => {
    await request(app)
        .get(`/tasks/${u1projectTwo._id}/${u1gymTask_1._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)
})


test('Should not fetch other users task', async () => {
    await request(app)
        .get(`/tasks/${u2_projectOne._id}/${u2_BookTask_1._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)
})


test('Should update own task', async () => {
    const response = await request(app)
        .patch(`/tasks/${u1projectOne._id}/${u1gymTask_1._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'handstand pushups',
            completed: true
        })
        .expect(200)

    const task = await Task.findById(u1gymTask_1._id)
    expect(task.description).toEqual('handstand pushups')
    expect(task.completed).toBe(true)
})

test('Should not update task with invalid fields', async () => {
    await request(app)
        .patch(`/tasks/${u1projectOne._id}/${u1gymTask_1._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Invalid field'
        })
        .expect(400)
})


test('Should delete own task', async () => {
    const response = await request(app)
        .delete(`/tasks/${u1projectOne._id}/${u1gymTask_1._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const task = await Task.findById(u1gymTask_1._id)
    expect(task).toBeNull()
})

test('Should not delete other users task', async () => {
    await request(app)
        .delete(`/tasks/${u2_projectOne._id}/${u2_BookTask_1._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)

    const task = await Task.findById(u2_BookTask_1._id)
    expect(task).not.toBeNull()
})

