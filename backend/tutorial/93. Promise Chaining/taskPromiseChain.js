require('../../src/db/mongoose')
const Task = require('../../src/models/task')


// Task.findByIdAndDelete('6801fe4fa7c5171b0c75632f').then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed: true})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })



// Task.findByIdAndUpdate('6801c3976dc7da1e4422bab0', { completed: true}).then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed: true})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id, incompleted) => {
    const user = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: incompleted })
    return user, count
}

deleteTaskAndCount('680227c3cd6929496b957573', false).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})

