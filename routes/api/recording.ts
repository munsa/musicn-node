import express = require('express');
import { identifyAudio } from '../../services/acousticFingerprintService';
import fs = require('fs');
import path = require('path');
const router = express.Router();
import multer from 'multer';
let processMultipart = multer({ storage: multer.memoryStorage() });

// @route   POST api/recording
// @desc    Test route
// @access  Public
router.post('/', processMultipart.array('test'), (req, res) => {
  let buffer: Buffer = new Buffer(0);
  req.on('data', data => {
    console.log('data');
    console.log(data);
    buffer = Buffer.concat([buffer, data]);
  });

  req.on('end', () => {
    console.log(buffer);
    identifyAudio(buffer);
    res.send('Recording sent');
  });
  //var filename = '../../services/sample.mp3';
  //var bitmap: Buffer = fs.readFileSync(path.resolve(__dirname, filename));
});

module.exports = router;
