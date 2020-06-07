import express = require('express');
import {identify} from '../../services/acousticFingerprintService';
const auth = require('../../middleware/auth');

const Recording = require('../../models/Recording');

const router = express.Router();


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

        if(result.status.code === 0) {
          const recording = new Recording({
            user: req.user.id,
            artists: result.metadata.music[0].artists.map(a => {
              return a['name']
            }).toString(),
            track: result.metadata.music[0].title,
            acrid: result.metadata.music[0].acrid,
            spotifyTrackId: result.metadata.music[0].external_metadata.spotify?.track.id,
            deezerTrackId: result.metadata.music[0].external_metadata.deezer?.track.id
          });

          // Save recording in the db
          await recording.save();
        }

        res.json(result);
      } else {
        console.log(err);
      }
    });
  });
});

router.get('/userRecordings/:user', auth, async (req: any, res) => {
  try {
    console.log(req.user);
    const userRecordings = await Recording.findOne({user: req.user.id});
    res.json(userRecordings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



module.exports = router;
