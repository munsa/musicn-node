import express = require('express');

const router = express.Router();
const auth = require('../../middleware/auth');
const Recording = require('../../models/Recording');
const User = require('../../models/User');
import {handleErrorAsync} from '../../middleware/error';

// @route   GET api/profile/:username
// @desc    Get profile by username
// @access  Public
router.get('/:username', auth, handleErrorAsync(async ({params: {username}}, res) => {
  const user = await User.findOne({username: username});
  const recordings = user ? await Recording.find({user: user._id}).limit(10).sort('-date') : '';

  const profile = {
    user: user,
    recordings: recordings
  }
  res.json(profile);
}));

module.exports = router;
