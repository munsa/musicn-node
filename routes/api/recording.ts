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

      try {
        switch (result.status.code) {
          case 0:
            const recording = await createRecordingObject(req.user.id, result.metadata.music[0]);
            await recording.save();
            recording._doc.success = true;
            res.json(recording);
            break;
          case 1001:
            res.json({ recording: {success: false}});
            break;
          case 2004:
            // Can't generate fingerprint
            res.status(500).send({ alert: { type: 'ERROR', msg: 'Can\'t generate fingerprint' }});
            break;
          default:
            res.status(500).send({ alert: { type: 'ERROR', msg: 'Unknown external API error' }});
            console.log(err);
        }
      } catch (e) {
        res.status(500).send({ alert: { type: 'ERROR', msg: 'Unknown external API error', detail: e }})
        console.log(e);
      }
    } else {
      res.status(500).send({ alert: { type: 'ERROR', msg: 'Unknown external API error', detail: err }});
    }
  });
});

const createRecordingObject = (idUser, music) => {
  return new Recording({
    user: idUser,
    acrid: music.acrid,
    genres: music.genres?.map(g => { return g['name'] }),
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
}

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
