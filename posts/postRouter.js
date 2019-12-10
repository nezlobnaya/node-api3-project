const express = require('express');
const Posts = require('./postDb')

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
});

router.get('/:id', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
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

module.exports = router;
