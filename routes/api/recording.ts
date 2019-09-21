import express = require('express');
import fs = require('fs');
import path = require('path');
import {identifyAudio} from '../../services/acousticFingerprintService';
import multer from 'multer';

const router = express.Router();
let processMultipart = multer({ storage: multer.memoryStorage() });
const WavEncoder = require('wav-encoder');

const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const { v4 } = require('uuid');

// @route   POST api/recording
// @desc    Test route
// @access  Public
router.post('/', processMultipart.array('audio'), (req, res) => {
  let buffer: Buffer = new Buffer(0);
  req.on('data', data => {
    console.log('data');
    console.log('length: ' + data.length);
    console.log(data);
    buffer = Buffer.concat([buffer, data]);
  });

  req.on('end', () => {
    console.log('end');
    console.log(buffer);
    /*let filename = '../../services/real_recording.wav';
    let bitmap: Buffer = fs.readFileSync(path.resolve(__dirname, filename));
    identifyAudio(buffer);*/

    const sound = {
      sampleRate: 44100,
      channelData: [new Float32Array(buffer)]
    };

    identifyAudio(buffer);

    const messageId = v4();
    writeFile('./temp/' + messageId + '.wav', new Buffer(buffer), 'base64')
        .then(() => {
          let filename = './../../temp/' + messageId + '.wav';
          let bitmap: Buffer = fs.readFileSync(path.resolve(__dirname, filename));
          identifyAudio(bitmap);
          //res.status(201).json({ message: 'Saved message' });
        })
        .catch(err => {
          console.log('Error writing message to file', err);
          res.sendStatus(500);
        });

    WavEncoder.encode(sound).then(bufferWav => {
      //identifyAudio(bufferWav);
      fs.writeFileSync('noise.wav', new Buffer(bufferWav));
    });

    //identifyAudio(buffer);
    res.send('Recording sent');
  });
});

module.exports = router;
