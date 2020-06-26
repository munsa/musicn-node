import express = require('express');

const router = express.Router();
const auth = require('../../middleware/auth');
const Recording = require('../../models/Recording');
const User = require('../../models/User');
import {errorHandlerWrapper} from '../../middleware/error';
import {CustomError} from "../../utils/error/customError";

// @route   GET api/profile/:username
// @desc    Get profile by username
// @access  Public
router.get('/:username', auth, errorHandlerWrapper(async ({params: {username}}, res) => {
  const user = await User.findOne({username: username});
  if(user) {
    const recordings = user ? await Recording.find({user: user._id}).limit(10).sort('-date') : '';

    const profile = {
      user: user,
      recordings: recordings
    }
    res.json(profile);
  } else {
    throw new CustomError(CustomError.USER_DOESNT_EXIST)
  }
}));

module.exports = router;
