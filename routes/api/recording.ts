import express = require('express');
import {identify} from '../../services/acousticFingerprintService';
const auth = require('../../middleware/auth');
import multer from 'multer';
let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

const Recording = require('../../models/Recording');

const router = express.Router();


// @route   POST api/recording
// @desc    Test route
// @access  Public
let cpUpload = upload.fields([{ name: 'audio'}]);
router.post('/', auth, cpUpload, async (req: any, res) => {
  let buffer: Buffer = req.files.audio[0].buffer;

  identify(buffer, async function (err, httpResponse, body) {
    if (!err) {
      const result = JSON.parse(body);
      console.log(result);

      if(result.status.code === 0) {
        const music = result.metadata.music[0];
        const recording = new Recording({
          user: req.user.id,
          acrid: music.acrid,
          genres: music.genres.map(g => { return g['name'] }),
          releaseDate: Date.parse(music.release_date),
          acoustId: {
            artists: music.artists,
            track: { name: music.title },
            album: music.album
          },
          spotify: {
            artists: music.external_metadata.spotify?.artists,
            track: music.external_metadata.spotify?.track,
            album: music.external_metadata.spotify?.album
          },
          deezer: {
            artists: music.external_metadata.deezer?.artists,
            track: music.external_metadata.deezer?.track,
            album: music.external_metadata.deezer?.album
          }
        });

        // Save recording in the db
        await recording.save();

        // TODO: Return document object instead of the one returned by the API. Save in db the needed info
        result.recordingId = recording.id;
      }

      res.json(result);
    } else {
      console.log(err);
    }
  });
});

router.put('/addGeolocation/:idRecording', auth, async ({params: {idRecording}, body: {geolocation}}, res) => {
  try {
    const recording = await Recording.findByIdAndUpdate(idRecording, {geolocation: geolocation});
    res.json(recording);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
