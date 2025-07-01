// const app = require('./app')
import app from './app.js'


// const port = process.env.PORT || 3000
const port = process.env.PORT 


// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET request are disable')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is Currently down. Check back soon!')
// })



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


// const Task = require('./models/task')
// const User = require('./models/user')
// const Project = require('./models/project')

// const main = async () => {
//     const project = await Project.findById('6845ae945b811b77d4b3e4fc')
//     await project.populate('owner')
//     // console.log(project)
//     // console.log(project.owner)
//     // console.log(task.owner.toString())

//     // const user = await User.findById('6845ae755b811b77d4b3e4f6') 
//     // await user.populate('projects')
//     // console.log(user, user.projects)

// }

// main()




// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1048576
//     },
//     fileFilter(req, file, cb) {
//         // if (!file.originalname.endsWith('.pdf')) {
//         //     return cb(new Error('Please upload a PDF'))
//         // }

//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Please upload a Word document'))
//         }

//         cb(undefined, true)
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })


// const jwt = require('jsonwebtoken')
// const mongoose = require('mongoose')
// const Task = require('./models/task')
// const User = require('./models/user')
// const Project = require('./models/project')


import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import Task from './models/task.js';
import User from './models/user.js';
import Project from './models/project.js';




const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Miles',
    email: 'test@gmail.com',
    // email: 'tirth744clg@gmail.com',
    password: 'test1234',
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

setupDatabase()
