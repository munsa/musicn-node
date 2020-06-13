import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RecordingSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  artists: {
    type: String,
    required: true
  },
  track: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  acrid: String,
  spotifyTrackId: String,
  deezerTrackId: String,
  geolocation: {
    latitude: String,
    longitude: String
  }
});

module.exports = mongoose.model('recording', RecordingSchema);
