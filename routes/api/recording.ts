import express = require('express');
import {identifyAudio} from '../../services/recording/recordingService';
const auth = require('../../middleware/auth');
import multer from 'multer';
import {handleErrorAsync} from "../../middleware/error";
let storage = multer.memoryStorage();
let upload = multer({ storage: storage });
const Recording = require('../../models/Recording');

const router = express.Router();


// @route   POST api/recording
// @desc    Test route
// @access  Public
let cpUpload = upload.fields([{ name: 'audio'}]);
router.post('/', auth, cpUpload, handleErrorAsync(async (req: any, res) => {
  let buffer: Buffer = req.files.audio[0].buffer;

  let result = await identifyAudio(buffer, req.user.id);

  if (result.recording){
    res.json(result);
  } else {
    res.status(500).send(result);
  }
}));



router.put('/addGeolocation/:idRecording', auth, handleErrorAsync(async ({params: {idRecording}, body: {geolocation}}, res) => {
  try {
    const recording = await Recording.findByIdAndUpdate(idRecording, {geolocation: geolocation});
    res.json(recording);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}));

module.exports = router;
