const express = require('express')
const Task = require('../models/task')
const Project = require('../models/project')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/tasks/:projectId', auth, async (req, res) => {
    // const task = new Task(req.body)

    const project_id = req.params.projectId

    const task = new Task({
        ...req.body,
        owner: req.user._id,
        taskByProject: project_id
    })

    try {

        const project = await Project.findOne({ _id: project_id, owner: req.user._id })

        if (!project) {
            return res.status(404).send({ error: 'Project not found' })
        }


        const tasks = await task.save()
        res.status(201).send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET / tasks?completed=true
// GET / tasks?limit=10&skip=20
// GET / tasks?sortBy=createAt_asc  (desc)
// GET / tasks?sortBy=createAt:desc

router.get('/tasks/:projectId', auth, async (req, res) => {
    const project_id = req.params.projectId
    const match = {}
    const sort = {}

    // Build match conditions for populate
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        // Find the project and populate its tasks
        const project = await Project.findOne({ _id: project_id, owner: req.user._id })
            .populate({
                path: 'tasksP', // Using the virtual field from project model
                match, // Filter tasks based on query parameters
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            })

        if (!project) {
            return res.status(404).send({ error: 'Project not found' })
        }

        res.send(project.tasksP) // Send the populated tasks
     
    } catch (e) {
        res.status(500).send(e)
    }
})


// router.get('/tasks/:projectId', auth, async (req, res) => {
//     const project_id = req.params.projectId
//     const match = { taskByProject: project_id, owner: req.user._id }
//     const sort = {}

//     if (req.query.completed) {
//         match.completed = req.query.completed === 'true'
//     }

//     if (req.query.sortBy) {
//         const parts = req.query.sortBy.split(':')
//         sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
//     }

//     try {
//         // Validate that the project exists and belongs to the user
//         const project = await Project.findOne({ _id: project_id, owner: req.user._id })
        
//         if (!project) {
//             return res.status(404).send({ error: 'Project not found' })
//         }

//         const tasks = await Task.find(match)
//             .limit(parseInt(req.query.limit))
//             .skip(parseInt(req.query.skip))
//             .sort(sort)

//         res.send(tasks)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })


router.get('/tasks/:projectId/:taskId', auth, async (req, res) => {
    const { projectId, taskId } = req.params

    try {
        const task = await Task.findOne({ 
            _id: taskId, 
            taskByProject: projectId, 
            owner: req.user._id 
        })

        if (!task) {
            return res.status(404).send({ error: 'Task not found' })
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:projectId/:taskId', auth, async (req, res) => {
    const { projectId, taskId } = req.params
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update fields' })
    }

    try {
        const task = await Task.findOne({ 
            _id: taskId, 
            taskByProject: projectId, 
            owner: req.user._id 
        })

        if (!task) {
            return res.status(404).send({ error: 'Task not found' })
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:projectId/:taskId', auth, async (req, res) => {
    const { projectId, taskId } = req.params

    try {
        const task = await Task.findOneAndDelete({ 
            _id: taskId, 
            taskByProject: projectId, 
            owner: req.user._id 
        })

        if (!task) {
            return res.status(404).send({ error: 'Task not found' })
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router