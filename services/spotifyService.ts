let SpotifyWebApi = require('spotify-web-api-node');
const SpotifyConfig = require('../config/external_apis/spotify.json')

// credentials are optional
let spotifyApi = new SpotifyWebApi({
  clientId: SpotifyConfig.spotify_client_id,
  clientSecret: SpotifyConfig.spotify_client_secret,
  redirectUri: 'http://www.example.com/callback'
});

// Get Elvis' albums
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
  function(data) {
    console.log('Artist albums', data.body);
  },
  function(err) {
    console.error(err);
  }
);