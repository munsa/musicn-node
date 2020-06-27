import express = require('express');
import {errorHandlerWrapper} from '../../middleware/error';
import {ProfileService} from '../../services/profileService';

const router = express.Router();
const auth = require('../../middleware/auth');

/**
 * @route   GET api/profile/:username
 * @desc    Get profile by username
 * @access  Public
 */
router.get('/:username', auth, errorHandlerWrapper(async ({params: {username}}, res) => {
  const result = await ProfileService.getProfileByUsername(username);
  res.json(result);
}));

module.exports = router;
