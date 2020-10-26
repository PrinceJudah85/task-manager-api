const mongoose = require('mongoose') // 
const validator = require('validator')// npm validator tool 
const bcrypt = require('bcryptjs') // npm API that hashes passwords
const jwt = require('jsonwebtoken') // npm authentication tool
const Task = require('./task')

const userSchema = new mongoose.Schema({ 
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true, // making this field in the document necessary for creating the document
    minlength: 7, // ensures that the password is at least 7 characters in length 
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password". Submit a different password.')
      }
    }
  },
  email: {
    type: String,
    unique: true, // ensures that each user in the database has a unique email
    required: true, // making this field in the document necessary for creating the document
    trim: true, // cuts out extra spaces before and after text
    lowercase: true, 
    validate(value) {
      if (!validator.isEmail(value)) { 
        throw new Error('Email is invalid')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

userSchema.virtual('myTasks', { // Adding a virtual property (Not actually built into the database) to the User Model to reference the relationship between user and task => user.virtual('nameOfProperty', { ref: theRelationshipModel, localField: theUserPropertyUsedInOtherModel, foreignField: thePropertyInOtherModelHoldingUserProperty})
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

//Creating custom schema middleware method to generate a json web token for a new client or client logging in // Methods are accessible on the instances AKA instance methods
userSchema.methods.generateAuthToken = async function () {
  const currentUser = this
  const token = await jwt.sign({ _id: currentUser._id.toString() }, 'thisismynewcourse') // currentUser._id is an ObjectID so toString() needs to be called because the payload(1st arg) in sign() only takes in a string. 

  currentUser.tokens = currentUser.tokens.concat({ token })
  await currentUser.save()

  return token
}

// Creating custom schema middleware method that returns only necessary user information 
userSchema.methods.toJSON = function () {
  const currentUser = this
  const userObject = currentUser.toObject() // mongoose.toObject() method converts mongoose document into javascript object

  delete userObject.password
  delete userObject.tokens


  return userObject
}

//Creating custom schema middleware method to validate a user by email & password. Can be accessed in other files as modelName.thisFunctionName (ex. User.findByCredentials)// static methods are accessible on the Model AKA Model Methods
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  
  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password) // bcrypt.compare() method takes 2 arguments : Plain_Text_Password , Hashed_Password

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) { //Using function declaration here to preserve the 'this' keyword
  const currentUser = this
  
  if (currentUser.isModified('password')) {
    currentUser.password = await bcrypt.hash(currentUser.password, 8)
  }

  next() // this middleware is asynchronous and is applied in the middle of an update to a document on the database. The next() function indicates that the middleware is finished applying, which is why it sits at the bottom of the middleware function block.  
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  const currentUser = this 
  await Task.deleteMany({ owner: currentUser._id })
  next()
})

// User model //
const User = mongoose.model('User', userSchema)

module.exports = User