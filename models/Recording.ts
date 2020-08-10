import mongoose from 'mongoose';
const { RecordingSourceSchema } = require('./RecordingSource');

export const RecordingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  acrid: String,
  genres: [String],
  releaseDate: Date,
  acrCloud: RecordingSourceSchema,
  spotify: RecordingSourceSchema,
  deezer: RecordingSourceSchema,
  geolocation: {
    latitude: Number,
    longitude: Number
  }
});

module.exports = mongoose.model('recording', RecordingSchema);
