import {CustomError} from '../utils/error/customError';
import {promisify} from 'util';
import {v4} from 'uuid';
import {ACRCloudService} from './acrCloudService';
import fs = require('fs');
import path = require('path');
import {SpotifyService} from './spotifyService';

const Recording = require('../models/Recording');
const writeFile = promisify(fs.writeFile);

export module RecordingService {
  /**
   * @name    identifyAudio
   * @param   buffer
   * @param   idUser
   * @return  Recording
   */
  export const identifyAudio = async (buffer: Buffer, idUser: number) => {
    const acrCloudResult = await ACRCloudService.identify(buffer);
    const result = JSON.parse(acrCloudResult.body);
    console.log(result);

    switch (result.status.code) {
      case 0:
        let recordingObject = createRecordingObject(idUser, result.metadata.music[0]);
        await recordingObject.save();
        return recordingObject
      case 1001:
        return null;
      case 2004:
        throw new CustomError(CustomError.CANT_GENERATE_FINGERPRINT);
      default:
        throw new CustomError(CustomError.UNKNOWN_ACRCLOUD_API_ERROR);
    }
  }

  /**
   * @name    createRecordingObject
   * @param   idUser
   * @param   music
   * @return  Recording
   */
  const createRecordingObject = (idUser: number, music: any) => {
    return new Recording({
      user: idUser,
      acrid: music.acrid,
      genres: music.genres?.map(g => {
        return g['name']
      }),
      releaseDate: Date.parse(music.release_date),
      acrCloud: {
        artists: music.artists,
        track: {name: music.title},
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

  /**
   * @name    addGeolocationToRecording
   * @param   idRecording
   * @param   geolocation
   * @return  Recording
   */
  export const addGeolocationToRecording = async (idRecording: number, geolocation: object) => {
    return await Recording.findByIdAndUpdate(idRecording, {geolocation: geolocation});
  }

  /**
   * @name    writeWavFile
   * @desc    Writes a .wav file from the buffer, useful for developing purposes
   * @param   buffer
   * @return  void
   */
  export const writeWavFile = (buffer: Buffer): void => {
    const messageId = v4();
    writeFile('./temp/' + messageId + '.wav', new Buffer(buffer), 'base64').then(() => {
      let filename = './../../temp/' + messageId + '.wav';
      let bitmap: Buffer = fs.readFileSync(path.resolve(__dirname, filename));
      //identifyAudio(bitmap);
    }).catch(err => {
      console.log('Error writing message to file', err);
    });
  }

  /**
   * @name    getUserRecordings
   * @param   idUser
   * @return  Recording[]
   */
  export const getUserRecordings = async (idUser: number) => {
    const userRecordings = await Recording.find({user: idUser}).limit(10).sort('-date');

    if(userRecordings.length > 0) {
      for (const r of userRecordings) {
        if (r.spotify?.track?.id) {
          r.spotify._doc.api = (await SpotifyService.getTrack(r.spotify.track.id)).body;
        }
      }
    }

    return userRecordings;
  }

  /**
   * @name    getAllRecordings
   * @return  Recording[]
   */
  export const getAllRecordings = async () => {
    return await Recording.find().populate('user', 'avatar');
  }
}