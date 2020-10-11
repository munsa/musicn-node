import express from 'express';
import {RecordingService} from '../../services/recordingService';
import multer from 'multer';
import {errorHandlerWrapper} from '../../middleware/error';
const auth = require('../../middleware/auth');

let storage = multer.memoryStorage();
let upload = multer({storage: storage});
const recordingRouter = express.Router();

/**
 * @route   POST api/recording/identify
 * @desc    Gets an audio, identifies it and saves it if success
 * @access  Public
 */
let cpUpload = upload.fields([{ name: 'audio'}, {name: 'geolocation'}]);
recordingRouter.post('/identify', auth, cpUpload, errorHandlerWrapper(async (req: any, res) => {
  const geolocation = JSON.parse(req.body.geolocation);
  const result = await RecordingService.identifyAudio(req.files.audio[0].buffer, req.user.id, geolocation);
  res.json(result);
}));

/**
 * @route   POST api/recording/addGeolocation/:idRecording
 * @desc    Adds the geolocation to the recording
 * @access  Public
 */
recordingRouter.put('/addGeolocation/:idRecording', auth, errorHandlerWrapper(async ({params: {idRecording}, body: {geolocation}}, res) => {
  const result = await RecordingService.addGeolocationToRecording(idRecording, geolocation);
  res.json(result);
}));

/**
 * @route   GET api/recording/all
 * @desc    Gets all the Recordings
 * @access  Public
 */
recordingRouter.get('/allGeolocations', auth, errorHandlerWrapper(async (req, res) => {
  const result = await RecordingService.getAllGeolocations();
  res.json(result);
}));

/**
 * @route   GET api/recording/:idRecording
 * @desc    Gets recording
 * @access  Public
 */
recordingRouter.get('/:idRecording', auth, errorHandlerWrapper(async ({params: {idRecording}}, res) => {
  const result = await RecordingService.getRecordingFromId(idRecording);
  res.json(result);
}));

/**
 * @route   GET api/recording/genre/:genreName
 * @desc    Gets a list of recordings of given genre.
 * @access  Public
 */
recordingRouter.get('/genre/:genreName', auth, errorHandlerWrapper(async ({params: {genreName}, query: {limit}}, res) => {
  const result = await RecordingService.getTopListFromGenre(genreName, parseInt(limit));
  res.json(result);
}));

export default recordingRouter;
