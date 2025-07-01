require('../../src/db/mongoose')
const User = require('../../src/models/user')

// User.findByIdAndUpdate('6801c43e9d6b9ab8fbda2277', { age: 18}).then((user) => {
//     console.log(user)
//     return User.countDocuments({age: 1})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })


const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age})
    const count = await User.countDocuments({ age })
    return user, count
}

updateAgeAndCount('6801c43e9d6b9ab8fbda2277', 2).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})







