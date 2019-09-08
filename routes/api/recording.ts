import express = require('express');
import { identifyAudio } from '../../services/acousticFingerprintService';
import fs = require('fs');
import path = require('path');
const router = express.Router();
import multer from 'multer';
let processMultipart = multer({ storage: multer.memoryStorage() });
const WavEncoder = require('wav-encoder');

// @route   POST api/recording
// @desc    Test route
// @access  Public
router.post('/', processMultipart.array('audio'), (req, res) => {
  let buffer: Buffer = new Buffer(0);
  req.on('data', data => {
    console.log('data');
    console.log('length: ' + data.length);
    buffer = Buffer.concat([buffer, data]);
  });

  req.on('end', () => {
    console.log('end');
    console.log(buffer);
    //let filename = '../../services/sample_low.wav';
    //let bitmap: Buffer = fs.readFileSync(path.resolve(__dirname, filename));

    const sound = {
      sampleRate: 44100,
      channelData: [
        new Float32Array(buffer)
      ]
    };

    WavEncoder.encode(sound).then(bufferWav => {
      identifyAudio(bufferWav.readUInt8());
      fs.writeFileSync('noise.wav', new Buffer(bufferWav));
    });

    //identifyAudio(buffer);
    res.send('Recording sent');
  });
});

module.exports = router;
