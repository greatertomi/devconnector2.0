const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const keys = require('../config/keys');

const router = express.Router();
const User = mongoose.model('user');

// TODO add GET that loads the user

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .send({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        id: user.id
      };

      const token = await jwt.sign(payload, keys.jwtSecret, {
        expiresIn: '10h'
      });
      res.send({ token });
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
