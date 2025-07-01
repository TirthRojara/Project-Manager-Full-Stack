const express = require('express')
const Project = require('../models/project')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/projects', auth, async (req, res) => {
    // const task = new Task(req.body)
    const project = new Project({
        ...req.body,
        owner: req.user._id
    })

    try {
        const projects = await project.save()
        res.status(201).send(projects)
    } catch (e) {
        res.status(400).send(e)
    }
})


// GET / tasks?completed=true
// GET / tasks?limit=10&skip=20
// GET / tasks?sortBy=createAt_asc  (desc)
// GET / tasks?sortBy=createAt:desc
router.get('/projects', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        // console.log(parts)
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        // const project = await Project.find({owner: req.user._id})
        // res.send(project)

        // await req.user.populate('projects')
        await req.user.populate({
            path: 'projects',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort    //: {
                    // createdAt: -1   // 1 = asc   -1 = desc
                    // completed: 1
                // }
            }
        })
        res.send(req.user.projects)
    } catch (e) {
        res.status(500).send()
    }

})


router.get('/projects/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id)
        const project = await Project.findOne({ _id, owner: req.user._id })

        if (!project) {
            return res.status(404).send()
        }

        res.send(project)

    } catch (e) {
        res.status(500).send()
    }
})


router.patch('/projects/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['projectName', 'completed']
    const isvalidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isvalidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        // const task = await Task.findById(req.params.id)
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id })

        if (!project) {
            return res.status(404).send()
        }

        updates.forEach((update) => project[update] = req.body[update])
        await project.save()

        res.send(project)

    } catch (e) {
        res.status(400).send(e)
    }

})


router.delete('/projects/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!project) {
            return res.status(404).send()
        }

        res.send(project)

    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router

