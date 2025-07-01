const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
const Project = require('../../src/models/project')


const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Miles',
    email: 'miles@gmail.com',
    // email: 'tirth744clg@gmail.com',
    password: 'miles744',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const u1projectOneId = new mongoose.Types.ObjectId()
const u1projectOne = {
    _id: u1projectOneId,
    projectName: 'GYM',
    owner: userOne._id
}
const u1projectTwoId = new mongoose.Types.ObjectId()
const u1projectTwo = {
    _id: u1projectTwoId,
    projectName: 'Coding Language',
    owner: userOne._id
}

const u1gymTask_1 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Push ups',
    completed: true,
    owner: userOne._id,
    taskByProject: u1projectOne._id
}
const u1gymTask_2 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Pull ups',
    owner: userOne._id,
    taskByProject: u1projectOne._id
}

const u1codeTask_1 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Java',
    completed: true,
    owner: userOne._id,
    taskByProject: u1projectTwo._id
}
const u1codeTask_2 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'python',
    owner: userOne._id,
    taskByProject: u1projectTwo._id
}


const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Jessy',
    email: 'Jessy@gmail.com',
    password: 'jessy744',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const u2_projectOneId = new mongoose.Types.ObjectId()
const u2_projectOne = {
    _id: u2_projectOneId,
    projectName: 'Books',
    owner: userTwo._id
}
const u2_projectTwoId = new mongoose.Types.ObjectId()
const u2_projectTwo = {
    _id: u2_projectTwoId,
    projectName: 'Climb',
    owner: userTwo._id
}

const u2_BookTask_1 = {
    _id: new mongoose.Types.ObjectId(),
    description: '$100 milion offer',
    completed: true,
    owner: userTwo._id,
    taskByProject: u2_projectOne._id
}
const u2_BookTask_2 = {
    _id: new mongoose.Types.ObjectId(),
    description: '12 rules of life',
    owner: userTwo._id,
    taskByProject: u2_projectOne._id
}

const u2_ClimbTask_1 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'v10',
    owner: userTwo._id,
    taskByProject: u2_projectTwo._id
}
const u2_ClimbTask_2 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'v12',
    owner: userTwo._id,
    taskByProject: u2_projectTwo._id
}




const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await Project.deleteMany()


    await new User(userOne).save()

    await new Project(u1projectOne).save()
    await new Task(u1gymTask_1).save()
    await new Task(u1gymTask_2).save()

    await new Project(u1projectTwo).save()
    await new Task(u1codeTask_1).save()
    await new Task(u1codeTask_2).save()


    await new User(userTwo).save()

    await new Project(u2_projectTwo).save()
    await new Task(u2_BookTask_1).save()
    await new Task(u2_BookTask_2).save()
    
    await new Project(u2_projectOne).save()
    await new Task(u2_ClimbTask_1).save()
    await new Task(u2_ClimbTask_2).save()

}

module.exports = {
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
}


