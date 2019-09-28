import express = require('express');
import fs = require('fs');
import path = require('path');
import {identify} from '../../services/acousticFingerprintService';
import {promisify} from 'util';
import {v4} from 'uuid';

const router = express.Router();
const writeFile = promisify(fs.writeFile);


// @route   POST api/recording
// @desc    Test route
// @access  Public
router.post('/', (req, res) => {
  let buffer: Buffer = new Buffer(0);

  // Receive buffer data event
  req.on('data', data => {
    buffer = Buffer.concat([buffer, data]);
  });

  // End receiving data event
  req.on('end', async () => {
    let result = identify(buffer, function (err, httpResponse, body) {
      if (err) {
        console.log(err);
      } else {
        console.log(body);
        res.json({body});
      }
    });
  });
});

// Writes a .wav file from the buffer.
// Useful for developing purposes
// Not used in production
function writeWavFile(buffer: Buffer) {
  const messageId = v4();
  writeFile('./temp/' + messageId + '.wav', new Buffer(buffer), 'base64').then(() => {
    let filename = './../../temp/' + messageId + '.wav';
    let bitmap: Buffer = fs.readFileSync(path.resolve(__dirname, filename));
    //identify(bitmap);
  }).catch(err => {
    console.log('Error writing message to file', err);
  });
}

module.exports = router;
