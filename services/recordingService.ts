import {CustomError} from '../utils/error/customError';
import {promisify} from 'util';
import {v4} from 'uuid';
import {RecordingSchema} from '../models/Recording';
import {AcoustIdService} from './acoustIdService';
import fs = require('fs');
import path = require('path');

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
    return new Promise((resolve, reject) => {
      AcoustIdService.identify(buffer, async function (err, httpResponse, body) {

        let recordingResult;
        if (!err) {
          const result = JSON.parse(body);
          console.log(result);

          switch (result.status.code) {
            case 0:
              recordingResult = createRecordingObject(idUser, result.metadata.music[0]);
              await recordingResult.save();
              break;
            case 1001:
              recordingResult = null;
              break;
            case 2004:
              reject();
              throw new CustomError(CustomError.CANT_GENERATE_FINGERPRINT);
            default:
              reject();
              throw new CustomError(CustomError.UNKNOWN_ACOUSTID_API_ERROR);
          }
        } else {
          reject();
          throw new CustomError(CustomError.UNKNOWN_ACOUSTID_API_ERROR);
        }

        resolve(recordingResult);
      })
    });
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
      acoustId: {
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
    return await RecordingSchema.findByIdAndUpdate(idRecording, {geolocation: geolocation});
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
    return await Recording.find({user: idUser}).limit(10).sort('-date');
  }
}