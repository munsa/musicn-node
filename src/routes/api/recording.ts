import express from 'express';
import {RecordingService} from '../../services/recordingService';
import multer from 'multer';
import {errorHandlerWrapper} from '../../middleware/error';
const auth = require('../../middleware/auth');

let storage = multer.memoryStorage();
let upload = multer({storage: storage});
const router = express.Router();

/**
 * @route   POST api/recording/identify
 * @desc    Gets an audio, identifies it and saves it if success
 * @access  Public
 */
let cpUpload = upload.fields([{ name: 'audio'}, {name: 'geolocation'}]);
router.post('/identify', auth, cpUpload, errorHandlerWrapper(async (req: any, res) => {
  const geolocation = JSON.parse(req.body.geolocation);
  const result = await RecordingService.identifyAudio(req.files.audio[0].buffer, req.user.id, geolocation);
  res.json(result);
}));

/**
 * @route   POST api/recording/addGeolocation/:idRecording
 * @desc    Adds the geolocation to the recording
 * @access  Public
 */
router.put('/addGeolocation/:idRecording', auth, errorHandlerWrapper(async ({params: {idRecording}, body: {geolocation}}, res) => {
  const result = await RecordingService.addGeolocationToRecording(idRecording, geolocation);
  res.json(result);
}));

/**
 * @route   GET api/recording/all
 * @desc    Gets all the Recordings
 * @access  Public
 */
router.get('/allGeolocations', auth, errorHandlerWrapper(async (req, res) => {
  const result = await RecordingService.getAllGeolocations();
  res.json(result);
}));

/**
 * @route   POST api/recording/:idRecording
 * @desc    Gets recording
 * @access  Public
 */
router.get('/:idRecording', auth, errorHandlerWrapper(async ({params: {idRecording}}, res) => {
  const result = await RecordingService.getRecordingFromId(idRecording);
  res.json(result);
}));

module.exports = router;
