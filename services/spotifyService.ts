let SpotifyWebApi = require('spotify-web-api-node');
const SpotifyConfig = require('../config/external_apis/spotify.json')

export module SpotifyService {

  let spotifyApi = new SpotifyWebApi({
    clientId: SpotifyConfig.spotify_client_id,
    clientSecret: SpotifyConfig.spotify_client_secret
  });

  // Retrieve an access token.
  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function (err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );

  // Get Elvis' albums
  export const getElvis = (): void => {
    spotifyApi.getTrack('4i8ObH2xPP4DSNniUJlgar').then(
      function (data) {
        console.log('Artist albums', data.body);
        console.log('The access token is ' + spotifyApi.getAccessToken());
        console.log('The refresh token is ' + spotifyApi.getRefreshToken());
        spotifyApi.resetAccessToken();
        spotifyApi.resetRefreshToken();
      },
      function (err) {
        console.error(err);
      }
    );
  }
}