import express from 'express';
const router = express.Router();
import {SpotifyService} from '../../services/spotifyService';

/**
 * @route   POST api/recording/identify
 * @desc    Gets an audio, identifies it and saves it if success
 * @access  Public
 */
router.get('/initCallback', ((req: any, res) => {
  console.log(req.body);
  SpotifyService.getElvis();
}));

module.exports = router;
