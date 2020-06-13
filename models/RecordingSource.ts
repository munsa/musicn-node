import mongoose from 'mongoose';

const RecordingSourceSchema = new mongoose.Schema({
  artists: {
    type: [{
      name: String,
      id: String
    }]
  },
  track: {
    name: String,
    id: String
  },
  album: {
    name: String,
    id: String
  }
});

module.exports.RecordingSourceSchema = RecordingSourceSchema;
module.exports.RecordingSourceModel = mongoose.model('recordingSourceSchema', RecordingSourceSchema);
