import express = require('express');
import fs = require('fs');
import path = require('path');
import {identify} from '../../services/acousticFingerprintService';
import {promisify} from 'util';
import {v4} from 'uuid';
const auth = require('../../middleware/auth');

const Recording = require('../../models/Recording');

const router = express.Router();
const writeFile = promisify(fs.writeFile);


// @route   POST api/recording
// @desc    Test route
// @access  Public
router.post('/', auth, async (req: any, res) => {
  let buffer: Buffer = new Buffer(0);

  // Receive buffer data event
  req.on('data', data => {
    buffer = Buffer.concat([buffer, data]);
  });

  // End receiving data event
  req.on('end', () => {
    identify(buffer, async function (err, httpResponse, body) {
      if (!err) {
        const result = JSON.parse(body);
        console.log(result);

        const recording = new Recording({
          user: req.user.id,
          artists: result.metadata.music[0].artists.map(a => {return a['name']}).toString(),
          track: result.metadata.music[0].title,
          spotifyTrackId: result.metadata.music[0].external_metadata.spotify?.track.id,
          deezerTrackId: result.metadata.music[0].external_metadata.deezer?.track.id
        });

        // Save recording in the db
        await recording.save();

        res.json(result);
      } else {
        console.log(err);
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
