import express = require('express');
import { identifyAudio } from '../../services/acousticFingerprintService';
import fs = require('fs');
import path = require('path');
const router = express.Router();

// @route   POST api/recording
// @desc    Test route
// @access  Public
router.post('/', (req, res) => {
  var filename = '../../services/sample.wav';
  var bitmap: Buffer = fs.readFileSync(path.resolve(__dirname, filename));
  identifyAudio(bitmap);
  res.send('Recording sent');
});

module.exports = router;
