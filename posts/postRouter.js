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

router.get('/:id', validatePostId, async (req, res, next) => {
  // do your magic!
  try {
    res.json(await Posts.getById(req.params.id))
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', validatePostId, async (req, res, next) => {
  // do your magic!
  try {
    await Posts.remove(req.params.id)
    res.status(200).json({
      message: 'The post has been deleted!'
    }) 
    end()
  } catch(err) {
      next(err)
    }
});

router.put('/:id', validatePost, validatePostId, async (req, res, next) => {
  // do your magic!
  try {
    const payload = {
      text: req.body.text,
    }

    await Posts.update(req.params.id, payload)
    res.json(await Posts.getById(req.params.id))
  } catch(err) {
      next(err)
    }
});

// custom middleware

async function validatePostId(req, res, next) {
  // do your magic!
try {
  const post = await Posts.getById(req.params.id)

  if (post) {
    req.post = post
    next()
  } else {
    res.status(404).json({
      message: 'Post not found'
    })
  }
} catch(err) {
  console.log(err)
  next(err)
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
