import express = require('express');

const router = express.Router();
const auth = require('../../middleware/auth');
const Recording = require('../../models/Recording');
const User = require('../../models/User');
import {handleErrorWrapper} from '../../middleware/error';
import {BadRequestError} from "../../utils/error/badRequestError";

// @route   GET api/profile/:username
// @desc    Get profile by username
// @access  Public
router.get('/:username', auth, handleErrorWrapper(async ({params: {username}}, res) => {
  const user = await User.findOne({username: username});
  if(user) {
    const recordings = user ? await Recording.find({user: user._id}).limit(10).sort('-date') : '';

    const profile = {
      user: user,
      recordings: recordings
    }
    res.json(profile);
  } else {
    throw new BadRequestError(BadRequestError.USER_DOESNT_EXIST)
  }
}));

module.exports = router;
