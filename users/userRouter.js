// require('dotenv').config()
const express = require('express');
const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();


router.post('/', validateUser, async (req, res, next) => {
  // do your magic!
    try {
      const payload = {
        name: req.body.name,
      }
      const user = await Users.insert(payload)
      res.status(201).json(user)
    } catch(err) {
      next(err)
    }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // do your magic!
  try {
    const payload = {
      text: req.body.text,
      user_id: req.params.id
    }
    const post = await Posts.insert(payload)
      res.status(201).json(post)
  } catch(err) {
     next(err)
  }
})

router.get('/', async (req, res, next) => {
  // do your magic!
  try {
    const users = await Users.get(req.query)
    const messageOfTheDay = process.env.MOTD || "Catch 'em all!"
    res.status(200).json({ motd: messageOfTheDay , users });
  } catch (err) {
    console.log(err)
    next(err)
  }
});

router.get('/:id', validateUserId, async (req, res, next) => {
  // do your magic!
  try {
    res.json(await Users.getById(req.params.id))
  } catch (err){
    next(err)
  }
 
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
    .then(posts => res.status(200).json(posts))
    .catch(error =>
      errorMessage(
        res,500,`Error getting users posts from the database`,error
      )
    );
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // do your magic!
  try {
    await Users.remove(req.params.id)
    res.status(200).json({
      message: 'The user has been deleted'
    })
    end()
  } catch(err) {
      next(err)
    }
});

router.put('/:id', validateUser, validateUserId, async (req, res, next) => {
  // do your magic!
  try {
    const payload = {
      name: req.body.name,
    }

    await Users.update(req.params.id, payload)
    res.json(await Users.getById(req.params.id))
  } catch(err) {
      next(err)
    }
});

//custom middleware

async function validateUserId(req, res, next) {
  // do your magic!
  try {
    const user = await Users.getById(req.params.id)
  
    if (user) {
          req.user = user
          next()
        } else {
          res.status(404).json({
            message: 'User not found'
          }) 
        }
      } catch(err) {
            console.log(err)
        next(err)
      }
    }


function validateUser(req, res, next) {
  // do your magic!
    if (!req.body.name) {
      res.status(400).json({
        message: 'Missing user name'
      })
    } else {
    next()
  }
}

function validatePost(req, res, next) {
  // do your magic!
    if (!req.body.text) {
      return res.status(400).json({
        message: 'Missing post content'
      })
    } else {
    next()
  }
}

module.exports = router;
