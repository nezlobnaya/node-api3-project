const express = require('express');
const Posts = require('./postDb')

const router = express.Router();

router.get('/', async (req, res) => {
  // do your magic!
  try {
    const posts = await Posts.get(req.query)
    res.status(200).json(posts);
  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: 'The posts information could not be retrieved.'
    })
  }
});

router.get('/:id', validatePostId(), (req, res) => {
  // do your magic!
  res.json(req.post)
});

router.delete('/:id', validatePostId(), (req, res) => {
  // do your magic!
  Posts.remove(req.post.id)
    .then(() => {
      res.status(200).json({
        message: 'The post has been deleted!'
      }) 
    })
    .catch(error => {
      next(error)
    })
});

router.put('/:id', validatePost(), (req, res) => {
  // do your magic!
  Posts.update(req.params.id, req.body)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(error => {
      next(error)
    })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  return (req, res, next) => {
  Posts.getById(req.params.id)
    .then(post => {
      if (post) {
        req.post = post
        next()
      } else {
        res.status(404).json({
          message: 'Post not found'
        })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'Error retrieving post'
      })
    })
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
