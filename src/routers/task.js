const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router() // Create new Router

// Setup Routes

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// GET /tasks?completed=true    => this Query search will only render documents who's completed fields = true
// GET /tasks?limit=10&skip=10  => this Query search will only render the second 10 results since 'skip' is skipping thru the first 10 results AKA Pagination
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {
  const match = {} // handles specific query searches of tasks data
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
    
  try {
    //const tasks = await Task.find({ owner: req.user._id }) //(Alternate solution)
    await req.user.populate({
      path: 'myTasks',
      match,
      options: {
        limit: parseInt(req.query.limit), // will allow the client to decide how many reuslts get rendered on the page
        skip: parseInt(req.query.skip), // will allow the client to decide how many results get skipped in the rendering process
        sort
      }
      }).execPopulate()
    res.send(req.user.myTasks)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({ _id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  
  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'})
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    updates.forEach((update) => task[update] = req.body[update])
    await task.save() 
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router