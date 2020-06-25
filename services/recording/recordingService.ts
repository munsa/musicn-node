import {identify} from '../external/acoustIdService';
import {CustomError} from "../../utils/error";
const Recording = require('../../models/Recording');

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