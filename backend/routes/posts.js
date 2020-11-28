const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth');

const Profile = mongoose.model('profile');
const Post = mongoose.model('post');
const User = mongoose.model('user');

const router = express.Router();

router.post(
  '/',
  [auth, check('text', 'Text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: 'Server Error' });
    }
  }
);

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: 'Server Error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send({ msg: 'Post not found' });
    }
    res.send(post);
  } catch (err) {
    console.log(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ msg: 'Post not found' });
    }
    res.status(500).send({ msg: 'Server Error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user.id) {
      return res.status(401).send({ msg: 'User not authorized' });
    }

    await post.remove();
    res.send({ msg: 'Post removed' });
  } catch (err) {
    console.log(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ msg: 'Post not found' });
    }
    res.status(500).send({ msg: 'Server Error' });
  }
});

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const checkLike = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    ).length;
    if (checkLike > 0) {
      return res.status(400).send({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    res.json(post.likes);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: 'Server Error' });
  }
});

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const checkLike = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    ).length;
    if (checkLike === 0) {
      return res.status(400).send({ msg: 'Post has not yet been liked' });
    }

    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: 'Server Error' });
  }
});

router.put(
  '/comment/:id',
  [auth, check('text', 'Text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: 'Server Error' });
    }
  }
);

router.delete('/comment/:id/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find((e) => e.id === req.params.commentId);

    if (!comment) {
      return res.status(404).send({ msg: 'Comment does not exist' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).send({ msg: 'User not authorized' });
    }

    const removeIndex = post.comments
      .map((e) => e.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: 'Server Error' });
  }
});

module.exports = router;
