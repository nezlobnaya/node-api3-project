const express = require('express');
const helmet = require('helmet')
const userRouter = require('./users/userRouter')
const postRouter = require('./posts/postRouter')
const server = express();

server.use(helmet())
server.use(logger)
server.use(express.json())

server.use('/api/posts', postRouter)

server.use('/api/users', userRouter)


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} Request - ${req.url} - ${new Date(Date.now())}`)
  next()
}

server.use((err, req, res, next) => {
  res.status(500).json({
    message: "Bad mistake!", err
  })
})

module.exports = server;
