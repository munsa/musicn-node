let SpotifyWebApi = require('spotify-web-api-node');
const SpotifyConfig = require('../config/external_apis/spotify.json')

export module SpotifyService {

  let spotifyApi = new SpotifyWebApi({
    clientId: SpotifyConfig.spotify_client_id,
    clientSecret: SpotifyConfig.spotify_client_secret
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
    const result = await spotifyApi.getTrack(trackId);
    console.log(result);
    return result;
  }

  export const getTracks = async (trackIds: string[]) => {
    return await spotifyApi.getTracks(trackIds);
  }

}