import express = require('express');

const router = express.Router();
const auth = require('../../middleware/auth');
const Recording = require('../../models/Recording');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');

// @route   GET api/profile/:username
// @desc    Get profile by username
// @access  Public
router.get('/:username', auth, async ({params: {username}}, res) => {
  try {
    const user = await User.findOne({username: username});
    const recordings = user ? await Recording.find({user: user._id}).limit( 10 ).sort( '-date' ) : '';

    const profile = {
        user: user,
        recordings: recordings
      }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({alert: { type: 'ERROR', msg: 'Server error', detail: err.message }});
  }
});

module.exports = router;
