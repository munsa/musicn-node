let SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');
dotenv.config();

export module SpotifyService {

  let spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  });

  // Retrieve an access token.
  const getCredentials = () => {
    spotifyApi.clientCredentialsGrant().then(
      function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);

        setTimeout(() => {
          getCredentials();
        }, data.body['expires_in'] * 1000);
      },
      function (err) {
        console.log('Something went wrong when retrieving an access token', err);
        getCredentials();
      }
    );
  }
  getCredentials();

  export const getTrack = async (trackId: string) => {
    return await spotifyApi.getTrack(trackId);
  }

  export const getTracks = async (trackIds: string[]) => {
    return await spotifyApi.getTracks(trackIds);
  }

  export const getSpotifyTrackInformation = async (recording) => {
    if (recording.spotify?.track?.id) {
      recording.spotify.api = (await SpotifyService.getTrack(recording.spotify.track.id)).body;
    }
    return recording;
  }

  export const getSpotifyTracksInformation = async (recordings) => {
    if (recordings.length > 0) {
      let trackIds = recordings.filter(r => {
        return r.spotify?.track?.id
      }).map(r => r.spotify.track.id);
      let trackList = (await SpotifyService.getTracks(trackIds)).body;
      trackList.tracks.forEach(a => {
        recordings.filter(r => {
          return r.spotify?.track?.id
        }).forEach(b => {
          if (a.id === b.spotify.track.id) {
            b.spotify.api = a;
          }
        });
      });
    }
  }
}