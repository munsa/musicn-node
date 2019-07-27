import mongoose = require('mongoose');

const RecoringSchema = new mongoose.Schema({
  song: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('recording', RecoringSchema);
