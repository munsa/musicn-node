import express = require('express');
import {identifyAudio} from '../../services/recordingService';
import multer from 'multer';
import {errorHandlerWrapper} from "../../middleware/error";

const auth = require('../../middleware/auth');

let storage = multer.memoryStorage();
let upload = multer({storage: storage});
const Recording = require('../../models/Recording');

const router = express.Router();


// @route   POST api/recording
// @desc    Test route
// @access  Public
let cpUpload = upload.fields([{name: 'audio'}]);
router.post('/', auth, cpUpload, errorHandlerWrapper(async (req: any, res) => {
  let buffer: Buffer = req.files.audio[0].buffer;
  let result = await identifyAudio(buffer, req.user.id);

  res.json(result);
}));

// @route   POST api/recording/addGeolocation/:idRecording
// @desc    Test route
// @access  Public
router.put('/addGeolocation/:idRecording', auth, errorHandlerWrapper(async ({params: {idRecording}, body: {geolocation}}, res) => {
  const recording = await Recording.findByIdAndUpdate(idRecording, {geolocation: geolocation});
  res.json(recording);
}));

module.exports = router;
