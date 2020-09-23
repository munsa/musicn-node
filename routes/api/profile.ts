import express = require('express');
import {errorHandlerWrapper} from '../../middleware/error';
import {ProfileService} from '../../services/profileService';
import {RecordingService} from '../../services/recordingService';

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

/**
 * @route   POST api/profile/:idUser/recordings
 * @desc    Gets recordings from user
 * @access  Public
 */
router.get('/:idUser/recordings', auth, errorHandlerWrapper(async ({params: {idUser}, query: {count, last}}, res) => {
  const recordings = await RecordingService.getUserRecordings(idUser, parseInt(count));
  const maxCount = await RecordingService.getUserRecordingsCount(idUser);
  const result = {
    recordings,
    maxCount
  }
  res.json(result);
}));

module.exports = router;
