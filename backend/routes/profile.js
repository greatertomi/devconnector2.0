const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// const auth = require('../middleware/auth');
const Profile = mongoose.model('profile');

router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.send(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Server Error' });
  }
});

module.exports = router;
