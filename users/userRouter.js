const express = require('express');
const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();


router.post('/', validateUser(), async (req, res) => {
  // do your magic!
    try {
      const user = await Users.insert(req.body)
      res.status(201).json(user)
    } catch(err) {
      next(err)
    }
});

router.post('/:id/posts', validateUserId(), validatePost(), (req, res) => {
  // do your magic!
    Posts.insert({ user_id: req.user.id, ...req.body })
      .then(post => res.status(201).json(post))
      .catch(error =>
        errorMessage(res, 500, `error adding post to the database`, error)
      );
  })

router.get('/', async (req, res) => {
  // do your magic!
  try {
    const users = await Users.get(req.query)
    const messageOfTheDay = process.env.MOTD || "Catch 'em all!'"
    res.status(200).json({ motd: messageOfTheDay, users });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: 'The users information could not be retrieved.'
    })
  }
});

router.get('/:id', validateUserId(), (req, res) => {
  // do your magic!
  res.json(req.user)
});

router.get('/:id/posts', validateUserId(), (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
    .then(posts => res.status(200).json(posts))
    .catch(error =>
      errorMessage(
        res,500,`Error getting users posts from the database`,error
      )
    );
});

router.delete('/:id', validateUserId(), (req, res) => {
  // do your magic!
  Users.remove(req.user.id)
    .then(() => {
      res.status(200).json({
        message: 'The user has been deleted'
      })
    })
    .catch(error => {
      next(error)
    })
});

router.put('/:id', validateUser(), (req, res) => {
  // do your magic!
  Users.update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(error => {
      next(error)
    })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  return (req, res, next) => {
    Users.getById(req.params.id)
      .then(user => {
        if (user) {
          req.user = user
          next()
        } else {
          res.status(404).json({
            message: 'User not found'
          }) 
        }
      })
          .catch(error => {
            console.log(error)
            res.status(500).json({
              message: 'Error retrieving user'
            })
          })
        }
  }


function validateUser(req, res, next) {
  // do your magic!
  return (req, res, next) => {
    if (!req.body.name) {
      return res.status(400).json({
        message: 'Missing user name'
      })
    } 
    next()
  }
}

function validatePost(req, res, next) {
  // do your magic!
  return (req, res, next) => {
    if (!req.body.text) {
      return res.status(400).json({
        message: 'Missing post content'
      })
    }
    next()
  }
}

module.exports = router;
