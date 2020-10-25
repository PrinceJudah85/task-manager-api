require('../src/db/mongoose')
const User = require('../src/models/user')

// Promise chaining
// User.findByIdAndUpdate('5f8e38b087424c2aa45d69d6', { age: 1 }).then((user) => {
//   console.log(user)
//   return User.countDocuments({ age: 1 })
// }).then((result) => {
//   console.log(result)
// }).catch((e) => {
//   console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age })
  const count = await User.countDocuments({ age })
  return count
}

updateAgeAndCount('5f8e38e687424c2aa45d69d7', 3).then((count) => {
  console.log(count)
}).catch((e) => {
  console.log(e)
})