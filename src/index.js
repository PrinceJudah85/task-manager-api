const express = require('express')
require('./db/mongoose') // by calling or requiring the file it ensures the file runs and connects to the database
const userRouter = require('./routers/user') // importing user Router
const taskRouter = require('./routers/task') // importing task Router

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // sets up express to automatically parse incoming json data to an object so it can be accessed in request handlers below
app.use(userRouter) // Accessing user router
app.use(taskRouter) // Accessing task router 

//
// Without middleware: new request -> run route handler
//
// With middleware:    new request -> do something -> run route handler
//                                    (middleware)

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
  //=== Printing out user data thru task.owner property ===//
  // const task = await Task.findById('5f94d69fd188bc77825b20b8')
  // await task.populate('owner').execPopulate()
  // console.log(task.owner)
  
  //=== Printing out task data thru a virtual property: user.myTasks ===//
//   const user = await User.findById('5f94d413b6235476e5acb5cd')
//   await user.populate('myTasks').execPopulate()
//   console.log(user.myTasks)
// }

// main()