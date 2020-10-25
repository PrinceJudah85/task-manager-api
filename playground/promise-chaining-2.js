require('../src/db/mongoose')
const Task = require('../src/models/task')

// Promise chaining
// Task.findByIdAndDelete('5f8d0f4a8add471be752cc88').then((task) => {
//   console.log(task)
//   return Task.countDocuments({ completed: false })
// }).then((result) => {
//   console.log(result)
// }).catch((e) => {
//   console.log(e)
// })

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({ completed: false })
  return count
}

deleteTaskAndCount('5f8efcd4564e108d57536ede').then((count) => {
  console.log(count)
}).catch((e) => {
  console.log(e)
})
 
