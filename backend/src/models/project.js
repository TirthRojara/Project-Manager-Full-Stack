const mongoose = require('mongoose')
const validator = require('validator')
const Task = require('./task')


const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        trim: true

    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})


projectSchema.virtual('tasksP', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'taskByProject'
})


// Delete tasks when project is removed
projectSchema.pre('findOneAndDelete', async function (next) {

    try {

        // const project = await this.model.findOne(this.getQuery())
        // const project = await Project.findOne(this.getQuery())
        // console.log(project)


        const project = this.getQuery()
        // console.log(project)
        // console.log(project._id)
        // console.log(project.owner.toString())
        // _id: '6846689916bf0483b48c4a01',
        //     owner: new ObjectId('6846689916bf0483b48c4a00')

        if(project) {
            console.log("Deleting tasks for project:", project._id)
            await Task.deleteMany({ taskByProject: project._id })
        }

    } catch (error) {
        console.log('error in delete tasks when project is removed')
    }

})


const Project = mongoose.model('Project', projectSchema)


module.exports = Project





