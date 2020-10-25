const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => { // this async middleware function will verify that the user making the HTTP request is authorized to do so
  try {
    const token = req.header('Authorization').replace('Bearer ', '') // 'token' variable is accessing the value of the Authorization property from within the header property of the HTTP request. This value is the JSON web token 
    const decoded = jwt.verify(token, 'thisismynewcourse') // 'decoded' variable is verifying the token provided above by passing the token value and the signature (string) used to originally generate the token into the jsonwebtoken.verify() method. This method returns the payload object which will include the unique user property(_id) used originally to generate the web token. 
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) // 'user' variable is searching for the user in the database who's _id propety matches the _id found in the payload object provided by the 'decoded' variable AND who's 'tokens' array property includes an object item named 'token' with the value provided by the 'token' variable above. 

    if (!user) { // if no user matching the search query in 'user' variable is returned, this if statement throws an error
      throw new Error() // executes the actions found in the catch block
    }

    req.token = token // adding a new property called 'token' to the request object and assigning it the value of token taken from the header of the request.
    req.user = user // adding a new property called 'user' to the request object and assigning it the value of user returned from the 'user' variable SO the route handler doesn't have to search for the user all over again. Instead it can just access the user by accessing this 'req' property. 
    next()// the next() method completes the middleware function and allows the route handler to execute
  } catch (e) {
    res.status(401).send({error: "Please authenticate"})
  }
}

module.exports = auth

// Middleware Example

// app.use((req, res, next) => { // The 'next' argument is specific to middleware
//   // console.log(req.method, req.path)
//   if (req.method === 'GET') {
//     res.send('GET requests are disabled')
//   } else {
//     next()
//   }
// })

// app.use((req, res, next) => {
//     res.status(503).send('The site is currently under maintenance. Please check back soon.')
// })

//JSON web token function example

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//   const token = jwt.sign({ email: 'abc123@express.com' }, 'thisismynewcourse', { expiresIn: '2 weeks'}) // The 1st argument in the sign() method is an object that must include a unique identifier for the user who's being authenticated, which will be embedded in the returning token. So in this case the id works. The 2nd argument is a random series of characters known as a signature. The 3rd, optional argument, is an object that gives you access to some options. One of which allows you to set the amount of time before the token expires. 
//   console.log(token)

//   const data = jwt.verify(token, 'thisismynewcourse') // verify() method takes 2 arguments: 1st argument is the json web token returned from the sign() method and the 2nd argument is the signature that was used to generate the token in the sign() method. Verify() method will return the payload for the token if it's valid or return an error if it doesn't. 
//   console.log(data)
// }

// myFunction()