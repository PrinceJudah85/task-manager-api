const express = require('express')
require('./db/mongoose') // by calling or requiring the file it ensures the file runs and connects to the database
const userRouter = require('./routers/user') // importing user Router
const taskRouter = require('./routers/task') // importing task Router

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // sets up express to automatically parse incoming json data to an object so it can be accessed in request handlers below
app.use(userRouter) // Accessing user router
app.use(taskRouter) // Accessing task router 



app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})