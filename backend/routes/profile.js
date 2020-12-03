const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const { check, validationResult } = require('express-validator');

const keys = require('../config/keys');

const router = express.Router();

const auth = require('../middleware/auth');

const Profile = mongoose.model('profile');

router.get('/me', auth, async (req, res) => {
  console.log(req.user);
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.send(profile);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send({ msg: 'Server Error' });
  }
});

router.post(
  '/',
  [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log('body', req.body);

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: 'Server Error' });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const profile = await Profile.find().populate('user', ['name', 'avatar']);
    res.send(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: 'Server Error' });
  }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).send({ msg: 'There is no profile for this user' });
    }
    res.send(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: 'Server Error' });
  }
});

// Delete profile, user and post
router.delete('/', async (req, res) => {
  try {
    await Profile.findOneAndRemove({
      user: req.user.id
    });

    await Profile.findOneAndRemove({
      _id: req.user.id
    });

    res.send({ msg: 'User deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: 'Server Error' });
  }
});

router.put(
  '/experience',
  [
    auth,
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.send(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: 'Server Error' });
    }
  }
);

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.send(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: 'Server Error' });
  }
});

router.put(
  '/education',
  [
    auth,
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.send(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: 'Server Error' });
    }
  }
);

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.send(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: 'Server Error' });
  }
});

router.get('/github/:username', async (req, res) => {
  const URL = `https://api.github.com/users/${req.params.username}/repos?per_page=5&
  sort=created:asc`;
  try {
    const options = {
      headers: { 'user-agent': 'node.js' },
      client_id: keys.githubClientId,
      client_secret: keys.githubSecret
    };

    const axiosResponse = await axios.get(URL, options);
    res.json(axiosResponse.data);
  } catch (err) {
    if (err.response.status === 404) {
      return res.status(404).send({ msg: 'Github profile not found' });
    }
    res.status(500).send({ msg: 'Server Error' });
  }
});

module.exports = router;
