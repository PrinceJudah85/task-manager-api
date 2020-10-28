const express = require('express')
require('./db/mongoose') // by calling or requiring the file it ensures the file runs and connects to the database
const userRouter = require('./routers/user') // importing user Router
const taskRouter = require('./routers/task') // importing task Router

const app = express()
const port = process.env.PORT || 3000

const multer = require('multer') // importing multer => a form-data middleware handler for file uploading
const auth = require('./middleware/auth')
const upload = multer({
  dest: 'images', // destination directory for uploaded files
  limits: {
    fileSize: 1000000 // limits.fileSize sets the file size limit for uploaded files, measured in bytes
  },
  fileFilter(req, file, cb) { // Allows you to filter the file uploads by the file type
    if (!file.originalname.match(/\.(doc|docx)$/)) { // LOOK UP more info on Regular Expressions (go to regex101.com to generate regular expressions)
      return cb(new Error('Please upload a Word Document')) // using Callback (cb) to send back error message
    }

    cb(undefined, true) // if the upload was successful
  }
})

const errorMiddleware = (req, res, next) => {
  throw new Error('From my middleware')
}

app.post('/upload', auth, upload.single('upload'), (req, res) => { // multer middleware gets added along with Auth, in between the route and the route handler callback functions// The 'upload' string inside the upload.single() multer middleware method is the value that must match as the key inside the request body form-data
  res.send()
}, (error, req, res, next) => { // this second call back is meant to handle errors thrown by the middleware function and uncaught by Express. It must contain this exact same call signature *(error, req, res, next)*
    res.status(400).send({error: error.message})
})



app.use(express.json()) // sets up express to automatically parse incoming json data to an object so it can be accessed in request handlers below
app.use(userRouter) // Accessing user router
app.use(taskRouter) // Accessing task router 


app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})