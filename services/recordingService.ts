import {identify} from './acoustIdService';
import {CustomError} from "../utils/error/customError";
import {promisify} from "util";
import {v4} from 'uuid';
import fs = require('fs');
import path = require('path');
import {RecordingSchema} from '../models/Recording';

const Recording = require('../models/Recording');
const writeFile = promisify(fs.writeFile);

export module RecordingService {
  export const identifyAudio = (buffer: Buffer, idUser: number): any => {
    identify(buffer, async function (err, httpResponse, body) {

      let recordingResult;
      if (!err) {
        const result = JSON.parse(body);
        console.log(result);

        switch (result.status.code) {
          case 0:
            recordingResult = await createRecordingObject(result.metadata.music[0], idUser);
            await recordingResult.save();
            break;
          case 1001:
            recordingResult = null;
            break;
          case 2004:
            throw new CustomError(CustomError.CANT_GENERATE_FINGERPRINT);
          default:
            throw new CustomError(CustomError.UNKNOWN_ACOUSTID_API_ERROR);
        }
      } else {
        throw new CustomError(CustomError.UNKNOWN_ACOUSTID_API_ERROR);
      }

      return recordingResult;
    });
  }

  const createRecordingObject = (idUser: number, music) => {
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

  export const addGeolocationToRecording = async (idRecording, geolocation) => {
    return await RecordingSchema.findByIdAndUpdate(idRecording, {geolocation: geolocation});
  }

  /***
   * Writes a .wav file from the buffer
   * Useful for developing purposes
   */
  function writeWavFile(buffer: Buffer) {
    const messageId = v4();
    writeFile('./temp/' + messageId + '.wav', new Buffer(buffer), 'base64').then(() => {
      let filename = './../../temp/' + messageId + '.wav';
      let bitmap: Buffer = fs.readFileSync(path.resolve(__dirname, filename));
      //identify(bitmap);
    }).catch(err => {
      console.log('Error writing message to file', err);
    });
  }
}