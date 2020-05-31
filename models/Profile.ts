import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  recordings: {
    type: [Schema.Types.ObjectId],
    ref: 'recording'
  }
});

module.exports = mongoose.model('profile', ProfileSchema);
