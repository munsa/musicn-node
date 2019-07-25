import mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  recordings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'recording'
  }
});

module.exports = mongoose.model('profile', ProfileSchema);
